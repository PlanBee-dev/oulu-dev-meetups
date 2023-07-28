import { Request } from '@cloudflare/workers-types';
import { Meetup, getMeetupIssueBody, meetupSchema } from 'meetup-shared';
import { Env } from './workerEnv';
import { App } from 'octokit';

export async function parseCreateIssueReqBody(req: Request): Promise<
  | {
      errorResponse: Response;
      parsedMeetup?: never;
    }
  | {
      errorResponse?: never;
      parsedMeetup: Meetup;
    }
> {
  let body: Meetup | null = null;

  try {
    const json = await req.json();

    const jsonParseResult = await meetupSchema.safeParseAsync(json);

    if (!jsonParseResult.success) {
      const errors = jsonParseResult.error.flatten().fieldErrors;

      console.error('Invalid JSON - schema parsing failed - ', errors);

      return {
        errorResponse: new Response(
          JSON.stringify({
            error: {
              message: 'Invalid JSON - schema parsing failed',
              details: errors,
            },
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      };
    }

    body = jsonParseResult.data;
  } catch (e) {
    console.error('Invalid JSON - catched an error', e);

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

  return { parsedMeetup: body };
}

export async function createIssue(props: { meetup: Meetup; env: Env }): Promise<
  | {
      errorResponse: Response;
      data?: never;
    }
  | {
      errorResponse?: never;
      data: {
        issueUrl: string;
        issueNumber: number;
      };
    }
> {
  try {
    const app = new App({
      appId: props.env.GITHUB_APP_ID,
      privateKey: props.env.GITHUB_APP_PRIVATE_KEY,
    });

    const octokit = await app.getInstallationOctokit(
      props.env.GITHUB_APP_INSTALLATION_ID,
    );

    const createdIssue = await octokit.rest.issues.create({
      owner: 'veeti-k',
      repo: 'oulu-dev-meetups',
      labels: ['meetup'],
      title: props.meetup.title,
      body: getMeetupIssueBody(props.meetup),
    });

    return {
      data: {
        issueUrl: createdIssue.data.html_url,
        issueNumber: createdIssue.data.number,
      },
    };
  } catch (e) {
    console.error('Failed to create issue', e);

    return {
      errorResponse: new Response(undefined, { status: 500 }),
    };
  }
}
