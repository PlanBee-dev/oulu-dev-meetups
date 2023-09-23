import { createIssue, parseCreateIssueReqBody } from './workerCreateIssue';
import { Env } from './workerEnv';

export async function handleRequest(req: Request, env: Env): Promise<Response> {
  const meetupParseResult = await parseCreateIssueReqBody(req);

  if ('errorResponse' in meetupParseResult) {
    return meetupParseResult.errorResponse;
  }

  const createIssueRes = await createIssue({
    meetup: meetupParseResult.parsedMeetup,
    env,
  });

  if ('errorResponse' in createIssueRes) {
    return createIssueRes.errorResponse;
  }

  return new Response(
    JSON.stringify({
      issueNumber: createIssueRes.data.issueNumber,
      issueUrl: createIssueRes.data.issueUrl,
    }),
    {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}
