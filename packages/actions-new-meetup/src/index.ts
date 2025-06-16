import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import format from 'date-fns/format';
import {
  type Steps,
  getMeetupIssueCommentStatus,
  getMeetupMarkdownFileContent,
  getMeetupPullRequestContent,
  meetupFormValuesToMeetup,
  parseMeetupIssueBody,
} from 'meetup-shared';
import fs from 'node:fs/promises';
import { join } from 'node:path';
import { object, string, transform } from 'valibot';

const envSchema = object({
  MEETUP_FOLDER: string(),
  ISSUE_BODY: string(),
  ISSUE_NUMBER: transform(string(), Number),
  GITHUB_TOKEN: string(),
});

async function main() {
  const env = envSchema.parse(process.env);

  const upsertComment = getUpsertComment({
    octokit: getOctokit(env.GITHUB_TOKEN),
    issue_number: env.ISSUE_NUMBER,
    owner: context.repo.owner,
    repo: context.repo.repo,
  });

  await upsertComment.withSteps([
    { status: 'loading' },
    { status: 'idle' },
    { status: 'idle' },
  ]);

  try {
    const meetupIssueBodyParseResult = await parseMeetupIssueBody(
      env.ISSUE_BODY,
    );

    if (!meetupIssueBodyParseResult.success) {
      throw new CustomError('Invalid issue body ', [
        { status: 'error', issues: meetupIssueBodyParseResult.error.issues },
        { status: 'idle' },
        { status: 'idle' },
      ]);
    }

    const meetupParseResult = await meetupFormValuesToMeetup(
      meetupIssueBodyParseResult.data,
    );

    if (!meetupParseResult.success) {
      throw new CustomError('Invalid issue body ', [
        {
          status: 'error',
          issues: meetupParseResult.error.issues,
        },
        { status: 'idle' },
        { status: 'idle' },
      ]);
    }

    const meetup = meetupParseResult.data;

    const sanitizedMeetupTitle = sanitizeString(meetup.title);

    const sanitizedDate = format(meetup.date, 'yyyy-MM-dd-HH-mm');

    await upsertComment.withSteps([
      { status: 'success' },
      { status: 'loading' },
      { status: 'idle' },
    ]);

    const newMeetupFile = getMeetupMarkdownFileContent(meetup);

    await fs
      .writeFile(
        join(
          '../../',
          env.MEETUP_FOLDER,
          `${sanitizedMeetupTitle}-${env.ISSUE_NUMBER}-${sanitizedDate}.md`,
        ),
        newMeetupFile,
      )
      .catch(() => {
        throw new CustomError('Error writing new meetup file', [
          { status: 'success' },
          { status: 'error', message: 'Error writing new meetup file' },
          { status: 'idle' },
        ]);
      });

    await upsertComment.withSteps([
      { status: 'success' },
      { status: 'success' },
      { status: 'loading' },
    ]);

    const newBranchName = `new-meetup-${env.ISSUE_NUMBER}`;

    const pullRequestTitle = `New meetup: ${meetup.title}`;
    const pullRequestBody = getMeetupPullRequestContent(
      meetup,
      env.ISSUE_NUMBER,
    );

    core.setOutput('branch_name', newBranchName);
    core.setOutput('pull_request_title', pullRequestTitle);
    core.setOutput('pull_request_body', pullRequestBody);
    core.setOutput('comment_id', upsertComment.comment_id);

    core.info('Done');
  } catch (err) {
    if (err instanceof CustomError) {
      console.error('Error creating meetup - ', err);

      upsertComment.withSteps(err.steps).catch((err) => {
        console.error('Error updating comment - ', err);
      });
    } else {
      console.error('Unexpected error creating meetup - ', err);

      upsertComment
        .withMessage('Unexpected error while creating meetup')
        .catch((err) => {
          console.error('Error updating comment - ', err);
        });
    }

    core.setFailed('Error creating meetup');
  }
}

void main();

function sanitizeString(str: string) {
  return str.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}

class CustomError extends Error {
  public readonly steps: Steps;

  constructor(message: string, steps: Steps) {
    super(`Custom error - ${message}`);

    this.steps = steps;
  }
}

function getUpsertComment({
  octokit,
  owner,
  repo,
  issue_number,
}: {
  octokit: ReturnType<typeof getOctokit>;
  owner: string;
  repo: string;
  issue_number: number;
}) {
  let _comment_id: number | undefined = undefined;

  return {
    withSteps: async (steps: Steps) => {
      const body = getMeetupIssueCommentStatus(steps);

      if (_comment_id) {
        await octokit.rest.issues
          .updateComment({
            comment_id: _comment_id,
            owner,
            repo,
            body,
          })
          .catch((err) => {
            console.error('Error updating comment', err);
          });
      } else {
        const res = await octokit.rest.issues
          .createComment({
            owner,
            repo,
            issue_number,
            body,
          })
          .catch((err) => {
            console.error('Error creating comment', err);
          });

        if (res) {
          _comment_id = res.data.id;
        }
      }
    },
    withMessage: async (message: string) => {
      const body = message;

      if (_comment_id) {
        await octokit.rest.issues
          .updateComment({
            comment_id: _comment_id,
            owner,
            repo,
            body,
          })
          .catch((err) => {
            console.error('Error updating comment', err);
          });
      } else {
        const res = await octokit.rest.issues
          .createComment({
            owner,
            repo,
            issue_number,
            body,
          })
          .catch((err) => {
            console.error('Error creating comment', err);
          });

        if (res) {
          _comment_id = res.data.id;
        }
      }
    },
    get comment_id() {
      return _comment_id;
    },
  };
}
