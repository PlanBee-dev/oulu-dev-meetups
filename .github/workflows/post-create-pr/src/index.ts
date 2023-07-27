import { context, getOctokit } from "@actions/github";
import { z } from "zod";

const envSchema = z.object({
	PULL_REQUEST_NUMBER: z.string().transform(Number),
	COMMENT_ID: z.string().transform(Number),
	GITHUB_TOKEN: z.string(),
});

async function main() {
	const env = envSchema.parse(process.env);

	const octokit = getOctokit(env.GITHUB_TOKEN);

	await octokit.rest.issues.updateComment({
		comment_id: env.COMMENT_ID,
		owner: context.repo.owner,
		repo: context.repo.repo,
		body: `
Hi there! Thanks for creating a new meetup. I'm going to create a new branch and pull request for you.

1. Validating meetup details... Done! ✅
2. Creating meetup file... Done! ✅
3. Creating new branch and pull request... Done! ✅ 

Here's the new pull request: #${env.PULL_REQUEST_NUMBER}`,
	});
}

main();
