type Step =
  | {
      status: 'idle' | 'loading' | 'success';
      error?: never;
    }
  | {
      status: 'error';
      error: Record<string, string[]>;
    };

export function getMeetupIssueCommentStatus(
  steps: readonly [Step, Step, Step],
) {
  const firstMessage =
    steps[0].status === 'idle'
      ? 'Validating meetup details...'
      : steps[0].status === 'loading'
      ? 'Validating meetup details...'
      : steps[0].status === 'success'
      ? 'Validating meetup details... Done! ✅'
      : steps[0].status === 'error'
      ? 'Validating meetup details... Failed! ❌' + showError(steps[0].error)
      : null;

  const secondMessage =
    steps[1].status === 'idle'
      ? 'Create meetup file'
      : steps[1].status === 'loading'
      ? 'Creating meetup file...'
      : steps[1].status === 'success'
      ? 'Creating meetup file... Done! ✅'
      : steps[1].status === 'error'
      ? 'Creating meetup file... Failed! ❌' + showError(steps[1].error)
      : null;

  const thirdMessage =
    steps[2].status === 'idle'
      ? 'Create new branch and pull request'
      : steps[2].status === 'loading'
      ? 'Creating new branch and pull request...'
      : null;

  return `
Hi there! Thanks for creating a new meetup. I'm going to create a new branch and pull request for you.

1. ${firstMessage}
2. ${secondMessage}
3. ${thirdMessage}`;
}

function showError(error: Record<string, string[]>) {
  return `<details>
<summary>Click to see the error</summary>

\`\`\`json
${JSON.stringify(error, null, 4)}
\`\`\`

</details>`;
}
