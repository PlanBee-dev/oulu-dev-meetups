import { ValidationErrors } from './formatValidationErrors';

type Step =
  | {
      status: 'idle' | 'loading' | 'success';
      error?: never;
    }
  | {
      status: 'error';
      errors: ValidationErrors;
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
      ? 'Validating meetup details... Failed! ❌' + showError(steps[0].errors)
      : null;

  const secondMessage =
    steps[1].status === 'idle'
      ? 'Create meetup file'
      : steps[1].status === 'loading'
      ? 'Creating meetup file...'
      : steps[1].status === 'success'
      ? 'Creating meetup file... Done! ✅'
      : steps[1].status === 'error'
      ? 'Creating meetup file... Failed! ❌' + showError(steps[1].errors)
      : null;

  const thirdMessage =
    steps[2].status === 'idle'
      ? 'Create new branch and pull request'
      : steps[2].status === 'loading'
      ? 'Creating new branch and pull request...'
      : steps[2].status === 'success'
      ? 'Creating new branch and pull request... Done! ✅'
      : steps[2].status === 'error'
      ? 'Creating new branch and pull request... Failed! ❌' +
        showError(steps[2].errors)
      : null;

  return (
    "Hi there! Thanks for creating a new meetup. I'm going to create a new branch and pull request for you." +
    '\n\n' +
    `1. ${firstMessage}` +
    '\n' +
    `2. ${secondMessage}` +
    '\n' +
    `3. ${thirdMessage}`
  );
}

function showError(error: ValidationErrors) {
  return `\n<details>

<summary>Click to see the error</summary>

\`\`\`json
${JSON.stringify(error, null, 4)}
\`\`\`

</details>\n`;
}
