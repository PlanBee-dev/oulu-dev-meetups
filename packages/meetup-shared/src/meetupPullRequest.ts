import { extractMeetupDateAndTime } from "./meetupForm";
import { type Meetup } from "./meetupType";

export function getMeetupPullRequestContent(
	meetup: Meetup,
	issueNumber: number,
) {
	const meetupDateAndTime = extractMeetupDateAndTime(meetup);

	return `New meetup

Date:
${meetupDateAndTime.date}

Time:
${meetupDateAndTime.time}

Organiser:
[${meetup.organizer}](${meetup.organizerLink})

Location:
[${meetup.location}](${meetup.locationLink})

Closes #${issueNumber}`;
}
