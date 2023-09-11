import {
  Meetup,
  checkMeetupData,
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
    title: 'React coding Meetup',
    description: 'Monthly meetup for coders',
    location: 'Oulu Library',
    locationLink: null,
    date: '2023-09-25 17:00',
    organizer: 'React Community',
    organizerLink: null,
    signupLink: 'https://www.meetup.com/react',
    image: 'react-meetup.jpg',
  },
});
meetups.push({
  data: {
    title: 'Vitest Meetup',
    description: 'Monthly meetup for Vitest users',
    location: 'Oulu University',
    locationLink: null,
    date: '2023-08-25 18:00',
    organizer: 'Vitest Community',
    organizerLink: null,
    signupLink: 'https://www.meetup.com/vitest',
    image: 'vitest-meetup.jpg',
  },
});
meetups.push({
  data: {
    title: 'Local AWS group Meetup',
    location: 'Oulu Elektroniikkatie',
    locationLink: 'https://goo.gl/maps/GvuboievRSW5VfZf6',
    date: '2023-10-03 17:00',
    organizer: 'Cloudinary',
    organizerLink: 'https://google.com',
    description:
      'Join us for an evening of cloud optimizing talks and discussions.',
    signupLink: 'https://meetup.com/local-aws-meetup',
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
    expect(new Date(parsedDate).toDateString()).toBe('Fri Aug 25 2023');
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
  expect(nextMeetup?.data.title).toBe('React coding Meetup');
});

test('check and fix meetup datas urls', () => {
  const meetup: Meetup = {
    data: {
      title: 'Test SECOND THIRD AND MORE FINAL New Meetup',
      signupLink: 'cloudamite.com',
      description: '## ARRR great pirate meetup \n\nbest download sites',
      organizer: 'Plan Bee',
      organizerLink: 'planbee.dev',
      date: '2023-09-21',
      time: '17:30',
      location: 'Elektroniikkatie 2',
      locationLink: '',
    },
  };

  checkMeetupData(meetup.data);
  expect(meetup.data.signupLink).toBe('https://cloudamite.com');
  expect(meetup.data.organizerLink).toBe('https://planbee.dev');
  expect(meetup.data.locationLink).toBe(
    'https://www.google.com/maps/place/Elektroniikkatie+2,+Oulu+Finland',
  );

  meetup.data.location = 'Kirkkokatu';
  meetup.data.locationLink = null;
  checkMeetupData(meetup.data);
  expect(meetup.data.locationLink).toBe(
    'https://www.google.com/maps/place/Kirkkokatu,+Oulu+Finland',
  );
});
