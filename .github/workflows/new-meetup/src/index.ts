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
		body: `
Hi there! Thanks for creating a new meetup. I'm going to create a new branch and pull request with the new meetup.

1. Validating meetup details...
2. Create new meetup file
3. Create new branch and pull request
`,
	});

	core.setOutput("comment_id", createCommentResponse.data.id);

	const sanitizedMeetupTitle = sanitizeString(issueTitle);

	const date = issueBody.match(getRegex("Time and date"))?.[1];
	const location = issueBody.match(getRegex("Location"))?.[1];
	const locationLinkGoogleMaps = issueBody.match(getRegex("Location as a Google Maps link"))?.[1];
	const organiser = issueBody.match(getRegex("Organiser"))?.[1];
	const organiserLink = issueBody.match(getRegex("Link to organiser"))?.[1];
	const joinLink = issueBody.match(getRegex("Joining link"))?.[1];

	core.info(`issueBody: ${issueBody}`);
	core.info(`date: ${issueBody.match(getRegex("Time and date"))}`);
	core.info(`location: ${issueBody.match(getRegex("Location"))}`);
	core.info(
		`locationLinkGoogleMaps: ${issueBody.match(getRegex("Location as a Google Maps link"))}`
	);
	core.info(`organiser: ${issueBody.match(getRegex("Organiser"))}`);
	core.info(`organiserLink: ${issueBody.match(getRegex("Link to organiser"))}`);
	core.info(`joinLink: ${issueBody.match(getRegex("Joining link"))}`);

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
			body: `
Hi there! Thanks for creating a new meetup. I'm going to create a new branch and pull request with the new meetup.

1. Validating meetup details...Failed! ❌
2. Creating meetup file...
3. Create new branch and pull request
`,
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
			body: `
Hi there! Thanks for creating a new meetup. I'm going to create a new branch and pull request with the new meetup.

1. Validating meetup details...Failed! ❌
2. Creating meetup file...
3. Create new branch and pull request
`,
		});

		core.setFailed("Invalid date");
		return;
	}

	await octokit.rest.issues.updateComment({
		comment_id: createCommentResponse.data.id,
		owner: context.repo.owner,
		repo: context.repo.repo,
		body: `
Hi there! Thanks for creating a new meetup. I'm going to create a new branch and pull request with the new meetup.

1. Validating meetup details...Done! ✅
2. Creating meetup file...
3. Create new branch and pull request
`,
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

	await octokit.rest.issues.updateComment({
		comment_id: createCommentResponse.data.id,
		owner: context.repo.owner,
		repo: context.repo.repo,
		body: `
Hi there! Thanks for creating a new meetup. I'm going to create a new branch and pull request with the new meetup.

1. Validating meetup details...Done! ✅
2. Creating meetup file...
3. Create new branch and pull request
`,
	});

	await fs.writeFile(
		`./${meetupFolder}/${sanitizedMeetupTitle}-${sanitizedDate}.md`,
		newMeetupFile
	);

	await octokit.rest.issues.updateComment({
		comment_id: createCommentResponse.data.id,
		owner: context.repo.owner,
		repo: context.repo.repo,
		body: `
Hi there! Thanks for creating a new meetup. I'm going to create a new branch and pull request with the new meetup.

1. Validating meetup details...Done! ✅
2. Creating meetup file...Done! ✅
3. Create new branch and pull request
`,
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

function getRegex(title: string) {
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
