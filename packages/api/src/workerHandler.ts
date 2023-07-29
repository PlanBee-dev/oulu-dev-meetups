import { parseCreateIssueReqBody, createIssue } from './workerCreateIssue';
import { Env } from './workerEnv';

export async function handleRequest(req: Request, env: Env): Promise<Response> {
  const meetupParseResult = await parseCreateIssueReqBody(req);

  if (meetupParseResult.errorResponse) {
    return meetupParseResult.errorResponse;
  }

  const meetup = meetupParseResult.parsedMeetup;

  const createIssueResult = await createIssue({ meetup, env });

  if (createIssueResult.errorResponse) {
    return createIssueResult.errorResponse;
  }

  return new Response(
    JSON.stringify({
      issueNumber: createIssueResult.data.issueNumber,
      issueUrl: createIssueResult.data.issueUrl,
    }),
    {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}
