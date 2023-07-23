import * as core from "@actions/core";

async function main() {
	const issueBody = core.getInput("issue_body");

	console.log(`issueBody: ${issueBody}`);
}

main();
