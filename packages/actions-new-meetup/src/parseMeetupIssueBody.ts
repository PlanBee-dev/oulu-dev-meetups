import { meetupFormValuesSchema } from 'meetup-shared';
import { safeParseAsync } from 'valibot';

export function parseMeetupIssueBody(body: string) {
  const unverifiedMeetupFormValues = {
    title: getValueFromBody(body, 'Meetup title'),
    date: getValueFromBody(body, 'Date'),
    time: getValueFromBody(body, 'Time'),
    location: getValueFromBody(body, 'Street address'),
    locationLink: addHttpsIfMissing(
      getValueFromBody(body, 'Maps link for address'),
    ),
    organizer: getValueFromBody(body, 'Organizer'),
    organizerLink: addHttpsIfMissing(getValueFromBody(body, 'Organizer link')),
    signupLink: addHttpsIfMissing(
      getValueFromBody(body, 'Signup link for meetup'),
    ),
    description: getRestAfterTitle(body, 'Description'),
  };

  return safeParseAsync(meetupFormValuesSchema, unverifiedMeetupFormValues);
}

function getValueFromBody(body: string, title: string) {
  const regex = new RegExp(`### ${title}\\s*\\n\\s*([\\s\\S]*?)\\s*\\n\\s*###`);
  const match = body.match(regex);

  if (match) {
    return match[1];
  }

  return null;
}

function getRestAfterTitle(body: string, title: string) {
  const regex = new RegExp(`### ${title}\\s*\\n\\s*([\\s\\S]*)`);
  const match = body.match(regex);

  if (match) {
    return match[1];
  }

  return null;
}

function addHttpsIfMissing(url: string | null) {
  if (url && !url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
}
