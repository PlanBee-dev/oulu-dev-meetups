import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import format from "date-fns/format";
import isValid from "date-fns/isValid";
import parse from "date-fns/parse";
import fs from "fs/promises";

async function main() {
	const githubToken = core.getInput("github_token", { required: true });

	const issueTitle = core.getInput("issue_title", { required: true });
	const issueBody = core.getInput("issue_body", { required: true });
	const issueNumber = Number(core.getInput("issue_number", { required: true }));
	const meetupFolder = core.getInput("meetup_folder", { required: true });

	if (isNaN(issueNumber)) {
		core.setFailed("Invalid issue number");
		return;
	}

	const octokit = getOctokit(githubToken);

	const createCommentResponse = await octokit.rest.issues.createComment({
		owner: context.repo.owner,
		repo: context.repo.repo,
		title: `New meetup: ${issueTitle}`,
		issue_number: issueNumber,
		body: getStatusMessage(["loading", "idle", "idle"]),
	});

	core.setOutput("comment_id", createCommentResponse.data.id);

	const sanitizedMeetupTitle = sanitizeString(issueTitle);

	const date = issueBody.match(getTitleParsingRegex("Time and date"))?.[1];
	const location = issueBody.match(getTitleParsingRegex("Location"))?.[1];
	const locationLinkGoogleMaps = issueBody.match(
		getTitleParsingRegex("Location as a Google Maps link")
	)?.[1];
	const organiser = issueBody.match(getTitleParsingRegex("Organiser"))?.[1];
	const organiserLink = issueBody.match(getTitleParsingRegex("Link to organiser"))?.[1];
	const joinLink = issueBody.match(getTitleParsingRegex("Joining link"))?.[1];

	const description = getDescription(issueBody);

	if (
		!date ||
		!location ||
		!locationLinkGoogleMaps ||
		!organiser ||
		!organiserLink ||
		!joinLink ||
		!description
	) {
		core.debug(`Date: ${date}`);
		core.debug(`Location: ${location}`);
		core.debug(`Location link: ${locationLinkGoogleMaps}`);
		core.debug(`Organiser: ${organiser}`);
		core.debug(`Organiser link: ${organiserLink}`);
		core.debug(`Join link: ${joinLink}`);
		core.debug(`Description: ${description}`);
		core.debug(`Issue body: ${issueBody}`);

		await octokit.rest.issues.updateComment({
			comment_id: createCommentResponse.data.id,
			owner: context.repo.owner,
			repo: context.repo.repo,
			body: getStatusMessage(["error", "idle", "idle"]),
		});

		core.setFailed("Invalid issue body");

		return;
	}

	const parsedDate = parse(date, "dd-MM-yyyy HH:mm", new Date());
	if (!isValid(parsedDate)) {
		await octokit.rest.issues.updateComment({
			comment_id: createCommentResponse.data.id,
			owner: context.repo.owner,
			repo: context.repo.repo,
			body: getStatusMessage(["error", "idle", "idle"]),
		});

		core.setFailed("Invalid date");
		return;
	}

	await octokit.rest.issues.updateComment({
		comment_id: createCommentResponse.data.id,
		owner: context.repo.owner,
		repo: context.repo.repo,
		body: getStatusMessage(["success", "loading", "idle"]),
	});
	const isoDate = parsedDate.toISOString();
	const sanitizedDate = format(parsedDate, "dd-MM-yyyy-HH-mm");

	const newMeetupFile = getMeetupFileContent({
		isoDate,
		organiser,
		organiserLink,
		location,
		locationLinkGoogleMaps,
		issueNumber,
		issueTitle,
		description,
		joinLink,
	});

	await fs.writeFile(
		`./${meetupFolder}/${sanitizedMeetupTitle}-${sanitizedDate}.md`,
		newMeetupFile
	);

	await octokit.rest.issues.updateComment({
		comment_id: createCommentResponse.data.id,
		owner: context.repo.owner,
		repo: context.repo.repo,
		body: getStatusMessage(["success", "success", "loading"]),
	});

	const newBranchName = `new-meetup-${sanitizedMeetupTitle}-${sanitizedDate}`;

	const pullRequestTitle = `New meetup: ${issueTitle}`;
	const pullRequestBody = getPullRequestBody({
		isoDate,
		organiser,
		organiserLink,
		location,
		locationLinkGoogleMaps,
		issueNumber,
	});

	core.setOutput("branch_name", newBranchName);
	core.setOutput("pull_request_title", pullRequestTitle);
	core.setOutput("pull_request_body", pullRequestBody);

	core.info("Done");
}

main();

function sanitizeString(str: string) {
	return str.replace(/[^a-z0-9]/gi, "-").toLowerCase();
}

function getPullRequestBody(props: {
	isoDate: string;
	organiser: string;
	organiserLink: string;
	location: string;
	locationLinkGoogleMaps: string;
	issueNumber: number;
}) {
	return `
New meetup

Date:
${props.isoDate}

Organiser:
[${props.organiser}](${props.organiserLink})

Location:
[${props.location}](${props.locationLinkGoogleMaps})

Closes #${props.issueNumber}`;
}

function getMeetupFileContent(props: {
	isoDate: string;
	organiser: string;
	organiserLink: string;
	location: string;
	locationLinkGoogleMaps: string;
	issueNumber: number;
	issueTitle: string;
	description: string;
	joinLink: string;
}) {
	return `
---
date: "${props.isoDate}"
location: "${props.location}"
locationGoogleMaps: "${props.locationLinkGoogleMaps}"
organiser: "${props.organiser}"
organiserLink: "${props.organiserLink}"
joinLink: "${props.joinLink}"
---

# ${props.issueTitle}

${props.description}`;
}

function getTitleParsingRegex(title: string) {
	return new RegExp(`### ${title}\\s*\\n\\s*([\\s\\S]*?)\\s*\\n\\s*###`);
}

function getDescription(issueBody: string) {
	const targetPhrase = "### Description";

	const descriptionIndex = issueBody.indexOf(targetPhrase);
	if (descriptionIndex === -1) {
		return null;
	}

	const resultString = issueBody.slice(descriptionIndex + targetPhrase.length);
	return resultString.trim();
}

type Status = "loading" | "success" | "error" | "idle";

function getStatusMessage(status: readonly [Status, Status, Status]) {
	const firstMessage =
		status[0] === "idle"
			? "Validating meetup details..."
			: status[0] === "loading"
			? "Validating meetup details..."
			: status[0] === "success"
			? "Validating meetup details... Done! ✅"
			: "Validating meetup details... Failed! ❌";

	const secondMessage =
		status[1] === "idle"
			? "Creating meetup file..."
			: status[1] === "loading"
			? "Creating meetup file..."
			: status[1] === "success"
			? "Creating meetup file... Done! ✅"
			: "Creating meetup file... Failed! ❌";

	const thirdMessage =
		status[2] === "idle"
			? "Create new branch and pull request"
			: status[2] === "loading"
			? "Creating new branch and pull request..."
			: null;

	return `
Hi there! Thanks for creating a new meetup. I'm going to create a new branch and pull request for you.

1. ${firstMessage}
2. ${secondMessage}
3. ${thirdMessage}`;
}
