import * as core from "@actions/core";
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

	const meetupTitle = sanitizeString(issueTitle);

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
		core.setFailed("Invalid issue body");
		return;
	}

	const parsedDate = parse(date, "dd-MM-yyyy HH:mm", new Date());
	if (!isValid(parsedDate)) {
		core.setFailed("Invalid date");
		return;
	}
	const isoDate = parsedDate.toISOString();

	const newMeetupFile =
		"---" +
		"\n" +
		`date: ${isoDate}` +
		"\n" +
		`location: ${location}` +
		"\n" +
		`locationGoogleMaps: ${locationLinkGoogleMaps}` +
		"\n" +
		`organiser: ${organiser}` +
		"\n" +
		`organiserLink: ${organiserLink}` +
		"\n" +
		`joinLink: ${joinLink}` +
		"\n" +
		"---" +
		"\n" +
		"\n" +
		`# ${issueTitle}` +
		"\n" +
		description;

	await fs.writeFile("new-meetup.md", newMeetupFile);

	const newBranchName = "new-meetup" + "-" + isoDate + "-" + meetupTitle;
	const pullRequestTitle = "New meetup: " + issueTitle;
	const pullRequestBody =
		`New meetup: ${issueTitle}` +
		"\n\n" +
		`Date: ${date}` +
		"\n\n" +
		`Organiser: [${organiser}](${organiserLink})` +
		"\n\n" +
		`Location: [${location}](${locationLinkGoogleMaps})` +
		"\n\n" +
		"\n\n" +
		`Closes #${issueNumber}`;

	core.setOutput("branch_name", newBranchName);
	core.setOutput("pull_request_title", pullRequestTitle);
	core.setOutput("pull_request_body", pullRequestBody);

	core.info("Done");
}

main();

function sanitizeString(str: string) {
	return str.replace(/[^a-z0-9]/gi, "_").toLowerCase();
}
