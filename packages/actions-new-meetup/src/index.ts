import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';
import fs from 'node:fs/promises';
import { z } from 'zod';

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
    title: `New meetup: ${env.ISSUE_TITLE}`,
    issue_number: env.ISSUE_NUMBER,
    body: getStatusMessage(['loading', 'idle', 'idle']),
  });

  core.setOutput('comment_id', createCommentResponse.data.id);

  const sanitizedMeetupTitle = sanitizeString(env.ISSUE_TITLE);

  const date = env.ISSUE_BODY.match(getTitleParsingRegex('Time and date'))?.[1];
  const location = env.ISSUE_BODY.match(getTitleParsingRegex('Location'))?.[1];
  const locationLinkGoogleMaps = env.ISSUE_BODY.match(
    getTitleParsingRegex('Location as a Google Maps link'),
  )?.[1];
  const organiser = env.ISSUE_BODY.match(
    getTitleParsingRegex('Organiser'),
  )?.[1];
  const organiserLink = env.ISSUE_BODY.match(
    getTitleParsingRegex('Link to organiser'),
  )?.[1];
  const joinLink = env.ISSUE_BODY.match(
    getTitleParsingRegex('Joining link'),
  )?.[1];

  const description = getDescription(env.ISSUE_BODY);

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
    core.debug(`Issue body: ${env.ISSUE_BODY}`);

    await octokit.rest.issues.updateComment({
      comment_id: createCommentResponse.data.id,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: getStatusMessage(['error', 'idle', 'idle']),
    });

    core.setFailed('Invalid issue body');

    return;
  }

  const parsedDate = parse(date, 'dd-MM-yyyy HH:mm', new Date());
  if (!isValid(parsedDate)) {
    await octokit.rest.issues.updateComment({
      comment_id: createCommentResponse.data.id,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: getStatusMessage(['error', 'idle', 'idle']),
    });

    core.setFailed('Invalid date');
    return;
  }

  await octokit.rest.issues.updateComment({
    comment_id: createCommentResponse.data.id,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: getStatusMessage(['success', 'loading', 'idle']),
  });
  const isoDate = parsedDate.toISOString();
  const sanitizedDate = format(parsedDate, 'dd-MM-yyyy-HH-mm');

  const newMeetupFile = getMeetupFileContent({
    isoDate,
    organiser,
    organiserLink,
    location,
    locationLinkGoogleMaps,
    issueNumber: env.ISSUE_NUMBER,
    issueTitle: env.ISSUE_TITLE,
    description,
    joinLink,
  });

  await fs.writeFile(
    `./${env.MEETUP_FOLDER}/${sanitizedMeetupTitle}-${sanitizedDate}.md`,
    newMeetupFile,
  );

  await octokit.rest.issues.updateComment({
    comment_id: createCommentResponse.data.id,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: getStatusMessage(['success', 'success', 'loading']),
  });

  const newBranchName = `new-meetup-${sanitizedMeetupTitle}-${sanitizedDate}`;

  const pullRequestTitle = `New meetup: ${env.ISSUE_TITLE}`;
  const pullRequestBody = getPullRequestBody({
    isoDate,
    organiser,
    organiserLink,
    location,
    locationLinkGoogleMaps,
    issueNumber: env.ISSUE_NUMBER,
  });

  core.setOutput('branch_name', newBranchName);
  core.setOutput('pull_request_title', pullRequestTitle);
  core.setOutput('pull_request_body', pullRequestBody);

  core.info('Done');
}

main();

function sanitizeString(str: string) {
  return str.replace(/[^a-z0-9]/gi, '-').toLowerCase();
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

function getTitleParsingRegex(title: string) {
  return new RegExp(`### ${title}\\s*\\n\\s*([\\s\\S]*?)\\s*\\n\\s*###`);
}

function getDescription(issueBody: string) {
  const targetPhrase = '### Description';

  const descriptionIndex = issueBody.indexOf(targetPhrase);
  if (descriptionIndex === -1) {
    return null;
  }

  const resultString = issueBody.slice(descriptionIndex + targetPhrase.length);
  return resultString.trim();
}

type Status = 'loading' | 'success' | 'error' | 'idle';

function getStatusMessage(status: readonly [Status, Status, Status]) {
  const firstMessage =
    status[0] === 'idle'
      ? 'Validating meetup details...'
      : status[0] === 'loading'
      ? 'Validating meetup details...'
      : status[0] === 'success'
      ? 'Validating meetup details... Done! ✅'
      : 'Validating meetup details... Failed! ❌';

  const secondMessage =
    status[1] === 'idle'
      ? 'Creating meetup file...'
      : status[1] === 'loading'
      ? 'Creating meetup file...'
      : status[1] === 'success'
      ? 'Creating meetup file... Done! ✅'
      : 'Creating meetup file... Failed! ❌';

  const thirdMessage =
    status[2] === 'idle'
      ? 'Create new branch and pull request'
      : status[2] === 'loading'
      ? 'Creating new branch and pull request...'
      : null;

  return `
Hi there! Thanks for creating a new meetup. I'm going to create a new branch and pull request for you.

1. ${firstMessage}
2. ${secondMessage}
3. ${thirdMessage}`;
}
