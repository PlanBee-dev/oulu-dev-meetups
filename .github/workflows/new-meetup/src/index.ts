import * as core from "@actions/core";
import format from "date-fns/format";
import isValid from "date-fns/isValid";
import parse from "date-fns/parse";
import fs from "fs/promises";

async function main() {
	const issueTitle = core.getInput("issue_title");
	const issueBody = core.getInput("issue_body");
	const issueNumber = core.getInput("issue_number");

	if (!issueTitle || !issueBody) {
		core.setFailed("Invalid inputs");
		return;
	}

	const sanitizedMeetupTitle = sanitizeString(issueTitle);

	const date = issueBody.match(/### Time and date\n\n(.*)/)?.[1];
	const location = issueBody.match(/### Location\n\n(.*)/)?.[1];
	const locationLinkGoogleMaps = issueBody.match(
		/### Location as a Google Maps link\n\n(.*)/
	)?.[1];
	const organiser = issueBody.match(/### Organiser\n\n(.*)/)?.[1];
	const organiserLink = issueBody.match(/### Link to organiser\n\n(.*)/)?.[1];
	const joinLink = issueBody.match(/### Joining link\n\n(.*)/)?.[1];

	const description = issueBody.match(/### Description\n\n(.*)/)?.[1];

	if (
		!date ||
		!location ||
		!locationLinkGoogleMaps ||
		!organiser ||
		!organiserLink ||
		!joinLink ||
		!description
	) {
		core.debug(
			JSON.stringify(
				{
					issueTitle,
					issueBody,
					issueNumber,
					date,
					location,
					locationLinkGoogleMaps,
					organiser,
					organiserLink,
					joinLink,
					description,
				},
				null,
				4
			)
		);
		core.setFailed("Invalid issue body");

		return;
	}

	const parsedDate = parse(date, "dd-MM-yyyy HH:mm", new Date());
	if (!isValid(parsedDate)) {
		core.setFailed("Invalid date");
		return;
	}
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

	await fs.writeFile(`${sanitizedMeetupTitle}-`, newMeetupFile);

	const newBranchName = "new-meetup" + "-" + sanitizedMeetupTitle + "-" + sanitizedDate;

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
	issueNumber: string;
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
	issueNumber: string;
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
