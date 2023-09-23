import { isValid, parse } from 'date-fns';
import {
  Output,
  ValiError,
  minLength,
  object,
  safeParseAsync,
  string,
  transform,
  url,
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
  title: string([minLength(1)]),
  description: string([minLength(1)]),
  date: transform(string([minLength(1)]), meetupFormDateSchema),
  time: transform(string([minLength(1)]), meetupFormTimeSchema),
  location: string([minLength(1)]),
  locationLink: string([url()]),
  organizer: string([minLength(1)]),
  organizerLink: string([url()]),
  signupLink: string([url()]),
} satisfies Record<MeetupFormField, unknown>);

export type MeetupFormValues = Output<typeof meetupFormValuesSchema>;

export async function meetupFormValuesToMeetup(
  meetupFormValues: MeetupFormValues,
) {
  const { date, time, ...rest } = meetupFormValues;

  return safeParseAsync(meetupSchema, {
    ...rest,
    date: new Date(`${date}T${time}:00`).toISOString(),
  });
}

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

  return input;
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

  return input;
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
