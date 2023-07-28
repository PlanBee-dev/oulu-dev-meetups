import {
  Meetup,
  MeetupKey,
  meetupKeyMap,
  meetupSchema,
} from './meetupBaseType';

export function getMeetupIssueBody(meetup: Meetup) {
  let issueBody = '';

  const length = Object.keys(meetupKeyMap).length;

  Object.entries(meetupKeyMap).forEach(([key, title], i) => {
    const isLast = i === length - 1;

    issueBody +=
      '### ' +
      title +
      '\n\n' +
      meetup[key as MeetupKey] +
      (isLast ? '' : '\n\n');
  });

  console.log({
    issueBody,
    meetupKeyMap,
  });

  return issueBody;
}

export function parseMeetupIssueBody(body: string) {
  const obj: Record<string | number | symbol, unknown> = {};

  const length = Object.keys(meetupKeyMap).length;

  Object.entries(meetupKeyMap).forEach(([title, key], i) => {
    const isLast = i === length - 1;

    // The last prop is a free text field, needs to be handled differently
    if (isLast) {
      const target = '### ' + title;

      const stringIndex = body.indexOf(target);
      if (stringIndex === -1) {
        obj[key] = '';
      } else {
        const resultString = body.slice(stringIndex + target.length);

        obj[key] = resultString.trim();
      }
    } else {
      const regex = getTitleParsingRegex(title);
      const match = body.match(regex);

      if (match) {
        obj[key] = match[1];
      }
    }
  });

  return meetupSchema.safeParseAsync(obj);
}

function getTitleParsingRegex(title: string) {
  return new RegExp(`### ${title}\\s*\\n\\s*([\\s\\S]*?)\\s*\\n\\s*###`);
}
