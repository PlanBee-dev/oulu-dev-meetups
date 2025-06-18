import { meetupSchema, type Meetup } from 'meetup-shared';
import { App } from 'octokit';
import { safeParseAsync } from 'valibot';
import { type Env } from './workerEnv';
import { tz } from '@date-fns/tz';
import { format } from 'date-fns';

export async function parseCreateIssueReqBody(
  req: Request,
): Promise<{ errorResponse: Response } | { parsedMeetup: Meetup }> {
  try {
    const json = await req.json();

    const meetupParseResult = await safeParseAsync(meetupSchema, json);

    if (!meetupParseResult.success) {
      const issues = meetupParseResult.error.issues;

      console.error('Invalid JSON - validation error - ', issues);

      return {
        errorResponse: new Response(
          JSON.stringify({
            error: {
              message: 'Invalid JSON - validation error',
              details: issues,
            },
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      };
    }

    return { parsedMeetup: meetupParseResult.data };
  } catch (e) {
    console.error('Invalid JSON - catched an error - ', e);

    return {
      errorResponse: new Response(
        JSON.stringify({
          error: {
            message: 'Invalid JSON - catched an error',
            details: e,
          },
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    };
  }
}

export async function createIssue(props: {
  meetup: Meetup;
  env: Env;
}): Promise<
  | { errorResponse: Response }
  | { data: { issueUrl: string; issueNumber: number } }
> {
  try {
    const app = new App({
      appId: props.env.GITHUB_APP_ID,
      privateKey: props.env.GITHUB_APP_PRIVATE_KEY,
    });

    const octokit = await app.getInstallationOctokit(
      props.env.GITHUB_APP_INSTALLATION_ID,
    );

    const createIssueRes = await octokit.rest.issues.create({
      owner: props.env.GITHUB_REPO_OWNER,
      repo: props.env.GITHUB_REPO_NAME,
      labels: ['meetup'],
      title: 'New meetup: ' + props.meetup.title,
      body: getMeetupIssueBody(props.meetup),
    });

    if (createIssueRes.status !== 201) {
      console.error(
        'Failed to create issue - github api did not respond with 201 - response: ',
        createIssueRes,
      );

      return {
        errorResponse: new Response(undefined, { status: 500 }),
      };
    }

    return {
      data: {
        issueUrl: createIssueRes.data.html_url,
        issueNumber: createIssueRes.data.number,
      },
    };
  } catch (e) {
    console.error('Failed to create issue - catched an error -', e);

    return {
      errorResponse: new Response(undefined, { status: 500 }),
    };
  }
}

export function getMeetupIssueBody(meetup: Meetup) {
  const { date, time } = extractDateAndTime(meetup.date);

  return `
### Meetup title

${meetup.title}

### Date

${date}

### Time

${time}

### Street address

${meetup.location}

### Maps link for address

${meetup.locationLink}

### Organizer

${meetup.organizer}

### Organizer link

${meetup.organizerLink}

### Signup link for meetup

${meetup.signupLink}

### Description

${meetup.description}`;
}

const EuropeHelsinki = tz('Europe/Helsinki');
function extractDateAndTime(date: Date) {
  return {
    date: format(date, 'yyyy-MM-dd', { in: EuropeHelsinki }),
    time: format(date, 'HH:mm', { in: EuropeHelsinki }),
  };
}
