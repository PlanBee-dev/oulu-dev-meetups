import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';
import {
  type Output,
  object,
  safeParseAsync,
  string,
  transform,
  url,
} from 'valibot';
import { meetupSchema } from './meetupType';
import { ValiError } from 'valibot';
import { type Meetup } from './meetupType';

export const meetupFormValuesSchema = object({
  title: string(),
  description: string(),
  date: transform(string(), meetupFormDateSchema),
  time: transform(string(), meetupFormTimeSchema),
  location: string(),
  locationLink: string([url()]),
  organizer: string(),
  organizerLink: string([url()]),
  signupLink: string([url()]),
});

export type MeetupFormValues = Output<typeof meetupFormValuesSchema>;

export async function meetupFormValuesToMeetup(
  meetupFormValues: MeetupFormValues,
) {
  const { date, time, ...rest } = meetupFormValues;

  return safeParseAsync(meetupSchema, {
    ...rest,
    date: parseMeetupDateAndTime(date, time),
  });
}

type MeetupFormDate = string & { __type: 'MeetupFormDate' };
type MeetupFormTime = string & { __type: 'MeetupFormTime' };

export function meetupFormDateSchema(input: string) {
  const parsedDate = parse(input, 'yyyy-MM-dd', new Date());

  if (!isValid(parsedDate)) {
    throw new ValiError([
      {
        input,
        message: 'Invalid date (format yyyy-MM-dd)',
        origin: 'value',
        reason: 'string',
        validation: 'date',
      },
    ]);
  }

  return input as MeetupFormDate;
}

export function meetupFormTimeSchema(input: string) {
  const parsedDate = parse(input, 'HH:mm', new Date());

  if (!isValid(parsedDate)) {
    throw new ValiError([
      {
        input,
        message: 'Invalid time (format HH:mm)',
        origin: 'value',
        reason: 'string',
        validation: 'time',
      },
    ]);
  }

  return input as MeetupFormTime;
}

export function parseMeetupDateAndTime(
  date: MeetupFormDate,
  time: MeetupFormTime,
) {
  return parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
}

export function extractMeetupDateAndTime(meetup: Meetup) {
  const date = format(meetup.date, 'yyyy-MM-dd') as MeetupFormDate;
  const time = format(meetup.date, 'HH:mm') as MeetupFormTime;

  return { date, time };
}
