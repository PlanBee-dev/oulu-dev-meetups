import { format } from 'date-fns';
import { type Meetup } from './meetupType';

export function getMeetupPullRequestContent(
  meetup: Meetup,
  issueNumber: number,
) {
  return `New meetup

Date:
${format(meetup.date, 'MMM do, yyyy @ HH:mm')}

Organizer:
[${meetup.organizer}](${meetup.organizerLink})

Location:
[${meetup.location}](${meetup.locationLink})

Closes #${issueNumber}`;
}
