import { context, getOctokit } from '@actions/github';
import { getMeetupIssueCommentStatus } from 'meetup-shared';
import { nullish, object, parse, string, transform } from 'valibot';

const envSchema = object({
  PULL_REQUEST_NUMBER: transform(string(), Number),
  COMMENT_ID: nullish(transform(string(), Number)),
  GITHUB_TOKEN: string(),
});

async function main() {
  const env = parse(envSchema, process.env);

  const octokit = getOctokit(env.GITHUB_TOKEN);

  const body =
    getMeetupIssueCommentStatus([
      { status: 'success' },
      { status: 'success' },
      { status: 'success' },
    ]) +
    '\n\n' +
    `Here's the new pull request: #${env.PULL_REQUEST_NUMBER}`;

  if (env.COMMENT_ID) {
    await octokit.rest.issues.updateComment({
      comment_id: env.COMMENT_ID,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body,
    });
  } else {
    await octokit.rest.issues.createComment({
      issue_number: env.PULL_REQUEST_NUMBER,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body,
    });
  }
}

void main();
