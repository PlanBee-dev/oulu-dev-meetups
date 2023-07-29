import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import server from './GithubAPI.mock';
import { handleRequest } from '../src/workerHandler';
import { onIssueCreated } from './GithubAPI.mock';
import { testEnvVars } from './_test.env-vars';

describe('createIssue', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  test('Calls github api to create an issue (happy path)', async () => {
    const response = await handleRequest(
      new Request('http://localhost:3000', {
        method: 'POST',
        headers: {
          Origin: 'http://localhost:3000',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test issue',
          description: 'Test description',
          organizer: 'Test organizer',
          organizerLink: 'https://example.com',
          location: 'Test location',
          locationLink: 'https://example.com',
          date: '2021-01-01',
          time: '12:00',
          signupLink: 'https://example.com',
        }),
      }),
      {
        ...testEnvVars,
        GITHUB_APP_INSTALLATION_ID: 123,
      },
    );

    expect(onIssueCreated).toHaveBeenCalledTimes(1);
    expect(onIssueCreated).toHaveBeenCalledWith({
      owner: 'veeti-k',
      repo: 'oulu-dev-meetups',
      body: expect.any(String) as string,
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      issueNumber: 1347,
      issueUrl: 'https://github.com/octocat/Hello-World/issues/1347',
    });
  });
});
