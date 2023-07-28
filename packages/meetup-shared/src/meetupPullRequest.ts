import { Meetup } from './meetupBaseType';

export function getMeetupPullRequestContent(
  meetup: Meetup,
  issueNumber: number,
) {
  return `New meetup

Date:
${meetup.date}

Time:
${meetup.time}

Organiser:
[${meetup.organizer}](${meetup.organizerLink})

Location:
[${meetup.location}](${meetup.locationLink})

Closes #${issueNumber}`;
}
