import { format } from 'date-fns';
import { type Meetup } from './meetupType';

const DATE_FORMAT = [
  // Month as Jan, Feb, ..., Dec
  'MMM',
  // Date as 1st, 2nd, ..., 31st
  'do,',
  // Year as 0044, 0001, 1900, 2017
  'yyyy',
  // Hours and minutes as 01:02
  'HH:mm',
].join(' ');

export function getMeetupPullRequestContent(
  meetup: Meetup,
  issueNumber: number,
) {
  return `New meetup

Date:
${format(meetup.date, DATE_FORMAT)}

Organizer:
[${meetup.organizer}](${meetup.organizerLink})

Location:
[${meetup.location}](${meetup.locationLink})

Closes #${issueNumber}`;
}
