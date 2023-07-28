import { context, getOctokit } from '@actions/github';
import { z } from 'zod';
import { getMeetupIssueCommentStatus } from 'meetup-shared';

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
    body: getMeetupIssueCommentStatus([
      { status: 'success' },
      { status: 'success' },
      { status: 'success' },
    ]),
  });
}

void main();
