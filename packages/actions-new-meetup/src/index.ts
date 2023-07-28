import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import format from 'date-fns/format';
import fs from 'node:fs/promises';
import { z } from 'zod';
import {
  getMeetupDate,
  getMeetupMarkdownFileContent,
  getMeetupPullRequestContent,
  getMeetupIssueCommentStatus,
  parseMeetupIssueBody,
} from 'meetup-shared';

const envSchema = z.object({
  MEETUP_FOLDER: z.string(),
  ISSUE_TITLE: z.string(),
  ISSUE_BODY: z.string(),
  ISSUE_NUMBER: z.string().transform(Number),
  GITHUB_TOKEN: z.string(),
});

async function main() {
  const env = envSchema.parse(process.env);

  const octokit = getOctokit(env.GITHUB_TOKEN);

  const createCommentResponse = await octokit.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: env.ISSUE_NUMBER,
    body: getMeetupIssueCommentStatus([
      { status: 'loading' },
      { status: 'idle' },
      { status: 'idle' },
    ]),
  });

  core.setOutput('comment_id', createCommentResponse.data.id);

  const meetupIssueBodyResult = await parseMeetupIssueBody(env.ISSUE_BODY);

  if (!meetupIssueBodyResult.success) {
    core.debug(
      `Invalid issue body - ${JSON.stringify(
        meetupIssueBodyResult.error.flatten().fieldErrors,
        null,
        4,
      )}`,
    );

    await octokit.rest.issues.updateComment({
      comment_id: createCommentResponse.data.id,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: getMeetupIssueCommentStatus([
        {
          status: 'error',
          error: meetupIssueBodyResult.error.flatten().fieldErrors,
        },
        { status: 'idle' },
        { status: 'idle' },
      ]),
    });

    core.setFailed('Invalid issue body');

    return;
  }

  const meetup = meetupIssueBodyResult.data;
  const sanitizedMeetupTitle = sanitizeString(meetup.title);

  const meetupDate = getMeetupDate(meetup.date, meetup.time);
  const sanitizedDate = format(meetupDate, 'yyyy-MM-dd-HH-mm');

  await octokit.rest.issues.updateComment({
    comment_id: createCommentResponse.data.id,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: getMeetupIssueCommentStatus([
      { status: 'success' },
      { status: 'loading' },
      { status: 'idle' },
    ]),
  });

  const newMeetupFile = getMeetupMarkdownFileContent(meetup);

  await fs.writeFile(
    `${env.MEETUP_FOLDER}/${sanitizedMeetupTitle}-${sanitizedDate}.md`,
    newMeetupFile,
  );

  await octokit.rest.issues.updateComment({
    comment_id: createCommentResponse.data.id,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: getMeetupIssueCommentStatus([
      { status: 'success' },
      { status: 'success' },
      { status: 'loading' },
    ]),
  });

  const newBranchName = `new-meetup-${sanitizedMeetupTitle}-${sanitizedDate}`;

  const pullRequestTitle = `New meetup: ${env.ISSUE_TITLE}`;
  const pullRequestBody = getMeetupPullRequestContent(meetup, env.ISSUE_NUMBER);

  core.setOutput('branch_name', newBranchName);
  core.setOutput('pull_request_title', pullRequestTitle);
  core.setOutput('pull_request_body', pullRequestBody);

  core.info('Done');
}

void main();

function sanitizeString(str: string) {
  return str.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}
