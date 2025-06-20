import { expect, test, vi } from 'vitest';
import { onCommentUpdated } from './GithubAPI.mock';

vi.mock('@actions/github', async () => {
  const actual = await vi.importActual<typeof import('@actions/github')>(
    '@actions/github',
  );

  return {
    ...actual,
    context: {
      repo: {
        owner: 'test-owner',
        repo: 'test-repo',
      },
    },
  };
});

test('sends pull request', async () => {
  const owner = 'test-owner';
  const repo = 'test-repo';
  const comment_id = '456';

  vi.stubEnv('PULL_REQUEST_NUMBER', '123');
  vi.stubEnv('COMMENT_ID', comment_id);
  vi.stubEnv('GITHUB_TOKEN', 'test-github-token');

  await import('../src/index');

  await vi.waitFor(() => expect(onCommentUpdated).toHaveBeenCalledTimes(1));
  expect(onCommentUpdated).toHaveBeenCalledWith({
    owner,
    repo,
    comment_id,
    body: expect.any(String) as string,
  });

  const { body } = JSON.parse(onCommentUpdated.mock.calls[0][0].body);
  expect(body).toMatchInlineSnapshot(`
      "Hi there! Thanks for creating a new meetup. I'm going to create a new branch and pull request for you.

      1. Validating meetup details... Done! ✅
      2. Creating meetup file... Done! ✅
      3. Creating new branch and pull request... Done! ✅

      Here's the new pull request: #123"
    `);
});
