type Status = 'loading' | 'success' | 'error' | 'idle';

export function getMeetupIssueCommentStatus(
  status: readonly [Status, Status, Status],
) {
  const firstMessage =
    status[0] === 'idle'
      ? 'Validating meetup details...'
      : status[0] === 'loading'
      ? 'Validating meetup details...'
      : status[0] === 'success'
      ? 'Validating meetup details... Done! ✅'
      : 'Validating meetup details... Failed! ❌';

  const secondMessage =
    status[1] === 'idle'
      ? 'Creating meetup file...'
      : status[1] === 'loading'
      ? 'Creating meetup file...'
      : status[1] === 'success'
      ? 'Creating meetup file... Done! ✅'
      : 'Creating meetup file... Failed! ❌';

  const thirdMessage =
    status[2] === 'idle'
      ? 'Create new branch and pull request'
      : status[2] === 'loading'
      ? 'Creating new branch and pull request...'
      : null;

  return `
Hi there! Thanks for creating a new meetup. I'm going to create a new branch and pull request for you.

1. ${firstMessage}
2. ${secondMessage}
3. ${thirdMessage}`;
}
