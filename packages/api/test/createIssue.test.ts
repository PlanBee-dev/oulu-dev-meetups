import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import server, { shouldCreateIssueFail } from './GithubAPI.mock';
import { onIssueCreated } from './GithubAPI.mock';
import { testEnvVars } from './_test.env-vars';
import handler from '../src/worker';

describe('createIssue', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => {
    server.resetHandlers();
    onIssueCreated.mockClear();
    shouldCreateIssueFail.mockClear();
  });

  test('Calls github api to create an issue (happy path)', async () => {
    shouldCreateIssueFail.mockReturnValue(false);

    const response = await handler.fetch(
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
      testEnvVars,
    );

    expect(onIssueCreated).toHaveBeenCalled();
    expect(onIssueCreated).toHaveBeenCalledWith({
      owner: 'test-repo-owner',
      repo: 'test-repo',
      body: expect.any(String) as string,
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      issueNumber: 1347,
      issueUrl: 'https://github.com/octocat/Hello-World/issues/1347',
    });
  });

  test('Returns 500 when call to github api fails', async () => {
    shouldCreateIssueFail.mockReturnValue(true);

    const response = await handler.fetch(
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
      testEnvVars,
    );

    expect(onIssueCreated).toHaveBeenCalled();
    expect(onIssueCreated).toHaveBeenCalledWith({
      owner: 'test-repo-owner',
      repo: 'test-repo',
      body: expect.any(String) as string,
    });

    expect(response.status).toBe(500);
  });
});
