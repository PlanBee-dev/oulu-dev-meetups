import {
  type InferOutput,
  minLength,
  object,
  safeParseAsync,
  string,
  url,
  pipe,
  isoDate,
  isoTime,
} from 'valibot';
import { meetupSchema } from './meetupType';

export const meetupFormFields = [
  'title',
  'description',
  'date',
  'time',
  'location',
  'locationLink',
  'organizer',
  'organizerLink',
  'signupLink',
] as const;

export type MeetupFormFields = typeof meetupFormFields;
export type MeetupFormField = MeetupFormFields[number];

export const meetupFormValuesSchema = object({
  title: pipe(string(), minLength(1)),
  description: pipe(string(), minLength(1)),
  date: pipe(string(), isoDate()),
  time: pipe(string(), isoTime()),
  location: pipe(string(), minLength(1)),
  locationLink: pipe(string(), url()),
  organizer: pipe(string(), minLength(1)),
  organizerLink: pipe(string(), url()),
  signupLink: pipe(string(), url()),
} satisfies Record<MeetupFormField, unknown>);

export type MeetupFormValues = InferOutput<typeof meetupFormValuesSchema>;

export async function meetupFormValuesToMeetup(
  meetupFormValues: MeetupFormValues,
) {
  const { date, time, ...rest } = meetupFormValues;

  return safeParseAsync(meetupSchema, {
    ...rest,
    date: new Date(`${date}T${time}:00`).toISOString(),
  });
}

export function assertMeetupFormFields(
  meetupFormValues: Record<string, unknown>,
): asserts meetupFormValues is Record<MeetupFormField, string> {
  if (!meetupFormValues || typeof meetupFormValues !== 'object') {
    throw new Error('Missing values');
  }

  meetupFormFields.forEach((key) => {
    if (!(key in meetupFormValues)) {
      throw new Error(`Meetup form values is missing '${key}'`);
    }
  });
}
