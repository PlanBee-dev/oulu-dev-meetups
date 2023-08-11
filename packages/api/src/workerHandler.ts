import { parseCreateIssueReqBody, createIssue } from './workerCreateIssue';
import { Env } from './workerEnv';

export async function handleRequest(req: Request, env: Env): Promise<Response> {
  const meetupFormValues = await parseCreateIssueReqBody(req);

  if (meetupFormValues.errorResponse) {
    return meetupFormValues.errorResponse;
  }

  const createIssueRes = await createIssue({
    meetupFormValues: meetupFormValues.parsedMeetup,
    env,
  });

  if (createIssueRes.errorResponse) {
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
