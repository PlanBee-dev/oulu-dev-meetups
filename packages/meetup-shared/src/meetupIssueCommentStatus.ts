import { Issues } from 'valibot';

export type Step =
  | { status: 'idle' | 'loading' | 'success' }
  | { status: 'error'; issues?: Issues; message?: string };

export type Steps = readonly [Step, Step, Step];

export function getMeetupIssueCommentStatus([
  firstStep,
  secondStep,
  thirdStep,
]: Steps) {
  return (
    "Hi there! Thanks for creating a new meetup. I'm going to create a new branch and pull request for you." +
    '\n\n' +
    `1. ${getFirstStepMessage(firstStep)}` +
    '\n' +
    `2. ${getSecondStepMessage(secondStep)}` +
    '\n' +
    `3. ${getThirdStepMessage(thirdStep)}`
  );
}

function getFirstStepMessage(step: Step) {
  switch (step.status) {
    case 'idle':
      return 'Validating meetup details...';
    case 'loading':
      return 'Validating meetup details...';
    case 'success':
      return 'Validating meetup details... Done! ✅';
    case 'error':
      return 'Validating meetup details... Failed! ❌' + showError(step);
  }
}

function getSecondStepMessage(step: Step) {
  switch (step.status) {
    case 'idle':
      return 'Create meetup file';
    case 'loading':
      return 'Creating meetup file...';
    case 'success':
      return 'Creating meetup file... Done! ✅';
    case 'error':
      return 'Creating meetup file... Failed! ❌' + showError(step);
  }
}

function getThirdStepMessage(step: Step) {
  switch (step.status) {
    case 'idle':
      return 'Create new branch and pull request';
    case 'loading':
      return 'Creating new branch and pull request...';
    case 'success':
      return 'Creating new branch and pull request... Done! ✅';
    case 'error':
      return (
        'Creating new branch and pull request... Failed! ❌' + showError(step)
      );
  }
}

function showError(error: { issues?: Issues; message?: string }) {
  return `\n<details>

<summary>Click to see the error</summary>

\`\`\`json
${JSON.stringify(error, null, 4)}
\`\`\`

</details>\n`;
}
