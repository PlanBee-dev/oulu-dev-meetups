import { afterEach, expect, test } from 'vitest';
import handler from '../src/worker';
import { onIssueCreated } from './GithubAPI.mock';
import { testEnvVars } from './_test.env-vars';

afterEach(() => {
  onIssueCreated.mockClear();
});

test('Calls github api to create an issue (happy path)', async () => {
  const response = await handler.fetch(
    new Request('http://localhost:4321', {
      method: 'POST',
      headers: {
        Origin: 'http://localhost:4321',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test issue',
        description: 'Test description',
        organizer: 'Test organizer',
        organizerLink: 'https://example.com',
        location: 'Test location',
        locationLink: 'https://example.com',
        date: '2021-01-01T12:00:00.000Z',
        signupLink: 'https://example.com',
      }),
    }),
    testEnvVars,
  );

  expect(response.status).toBe(201);

  expect(onIssueCreated).toHaveBeenCalled();
  expect(onIssueCreated).toHaveBeenCalledWith({
    owner: 'test-repo-owner',
    repo: 'test-repo',
    body: expect.any(String) as string,
  });

  expect(await response.json()).toEqual({
    issueNumber: 1347,
    issueUrl: 'https://github.com/octocat/Hello-World/issues/1347',
  });
});
