import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";

async function main() {
	const githubToken = core.getInput("github_token", { required: true });

	const commentId = Number(core.getInput("comment_id", { required: true }));
	const pullRequestNumber = Number(core.getInput("pull_request_number", { required: true }));

	const octokit = getOctokit(githubToken);

	await octokit.rest.issues.updateComment({
		comment_id: commentId,
		owner: context.repo.owner,
		repo: context.repo.repo,
		body: `
Hi there! Thanks for creating a new meetup. I'm going to create a new branch and pull request with the new meetup.

1. Validating meetup details... Done! ✅
2. Creating meetup file... Done! ✅
3. Create new branch and pull request... Done! ✅ 

PR: #${pullRequestNumber}`,
	});
}

main();
