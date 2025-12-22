import { expect, test, vi } from 'vitest';
import handler from '../src/worker';
import { testEnvVars } from './_test.env-vars';

// This test differs from other tests done with msw. It mocks `octokit`
// with vitest to avoid the retry logic in octokit alltogether. This was
// previously also done with msw and fake timers, but a new update made
// retry logic unskippable. This should be revisited in the future
// to see if `msw` can be used again.

const mockCreateIssue = vi.fn().mockResolvedValue({ status: 500 });
vi.mock('octokit', async (importOg) => {
  const og = await importOg<typeof import('octokit')>();

  const App = vi.fn(
    class {
      getInstallationOctokit = vi.fn().mockResolvedValue({
        rest: { issues: { create: mockCreateIssue } },
      });
    },
  );

  return { ...og, App };
});

test('Returns 500 when call to github api fails', async () => {
  const promise = handler.fetch(
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

  const response = await promise;

  expect(response.status).toBe(500);

  expect(mockCreateIssue).toHaveBeenCalledTimes(1);
  expect(mockCreateIssue).toHaveBeenCalledWith({
    owner: 'test-repo-owner',
    repo: 'test-repo',
    body: expect.any(String) as string,
    labels: ['meetup'],
    title: 'New meetup: Test issue',
    request: { fetch: expect.any(Function) },
  });
});
