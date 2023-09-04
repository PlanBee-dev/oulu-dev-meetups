import {
  Meetup,
  getNextMeetup,
  getRandomLogonumber,
  parseMeetupDate,
} from '../src/utils';
import { expect, test, beforeEach, afterEach, vi } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const meetups: Meetup[] = [];
meetups.push({
  data: {
    name: 'React coding Meetup',
    description: 'Monthly meetup for coders',
    location: 'Oulu Library',
    locationLink: null,
    time: '2023-09-25 17:00',
    organizer: 'React Community',
    organizerLink: null,
    meetupLink: 'https://www.meetup.com/react',
    image: 'react-meetup.jpg',
  },
});
meetups.push({
  data: {
    name: 'Vitest Meetup',
    description: 'Monthly meetup for Vitest users',
    location: 'Oulu University',
    locationLink: null,
    time: '2023-08-25 18:00',
    organizer: 'Vitest Community',
    organizerLink: null,
    meetupLink: 'https://www.meetup.com/vitest',
    image: 'vitest-meetup.jpg',
  },
});
meetups.push({
  data: {
    name: 'Local AWS group Meetup',
    location: 'Oulu Elektroniikkatie',
    locationLink: 'https://goo.gl/maps/GvuboievRSW5VfZf6',
    time: '2023-10-03 17:00',
    organizer: 'Cloudinary',
    organizerLink: 'https://google.com',
    description:
      'Join us for an evening of cloud optimizing talks and discussions.',
    meetupLink: 'https://meetup.com/local-aws-meetup',
    image: 'images/heroimages/4-meetup-image.jpg',
  },
});

test('random randomnumber returns number between 1-5', () => {
  for (let i = 0; i < 100; i++) {
    const randomNumber: number = getRandomLogonumber();
    expect(randomNumber).toBeGreaterThanOrEqual(1);
    expect(randomNumber).toBeLessThanOrEqual(5);
  }
});

test('date parsing works in user format', () => {
  const userDate = '2023-08-25 20:00';
  const parsedDate = parseMeetupDate(userDate);
  expect(parsedDate).toBeDefined();
  expect(parsedDate).not.toBeNull();
  if (parsedDate) {
    expect(
      new Date(parsedDate).toLocaleString('fi-FI', { timeZone: 'UTC' }),
    ).toBe('25.8.2023 17.00.00');
  }
});

test('date parsing works in system format', () => {
  const systemDate = 'Wed, 13 Sep 2023 16:30:00 GMT';
  const parsedDate = parseMeetupDate(systemDate);
  expect(parsedDate).toBeDefined();
  expect(parsedDate).not.toBeNull();
  if (parsedDate) {
    expect(new Date(parsedDate).toUTCString()).toBe(
      'Wed, 13 Sep 2023 16:30:00 GMT',
    );
  }
});

test('get next meetup from today', () => {
  const date = new Date(2023, 8, 4, 10, 0);
  vi.setSystemTime(date);
  const nextMeetup = getNextMeetup(meetups);
  expect(nextMeetup?.data.name).toBe('React coding Meetup');
});
