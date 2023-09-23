import { MeetupFormValues } from 'meetup-shared';
import {
  checkMeetupData,
  createShortDescription,
  getNextMeetup,
  getRandomLogonumber,
} from '../src/utils';
import { expect, test, beforeEach, afterEach, vi } from 'vitest';
import { FrontMeetups } from '../src/get-meetups';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test('random randomnumber returns number between 1-5', () => {
  for (let i = 0; i < 100; i++) {
    const randomNumber: number = getRandomLogonumber();
    expect(randomNumber).toBeGreaterThanOrEqual(1);
    expect(randomNumber).toBeLessThanOrEqual(5);
  }
});

test('get next meetup from today', () => {
  const meetups = [
    {
      title: 'Vue coding Meetup',
      date: new Date(2023, 8, 3, 10, 0),
    },
    {
      title: 'Angular coding Meetup',
      date: new Date(2023, 8, 4, 10, 0),
    },
    {
      title: 'React coding Meetup',
      date: new Date(2023, 8, 5, 10, 0),
    },
  ];

  const date = new Date(2023, 8, 4, 10, 0);
  vi.setSystemTime(date);
  const nextMeetup = getNextMeetup(meetups as unknown as FrontMeetups);
  expect(nextMeetup?.title).toBe('React coding Meetup');
});

test('check and fix meetup datas urls', () => {
  const meetup: MeetupFormValues = {
    title: 'Test SECOND THIRD AND MORE FINAL New Meetup',
    signupLink: 'cloudamite.com',
    description: '## ARRR great pirate meetup \n\nbest download sites',
    organizer: 'Plan Bee',
    organizerLink: 'planbee.dev',
    date: '2023-09-21',
    time: '17:30',
    location: 'Elektroniikkatie 2',
    locationLink: '',
  };

  checkMeetupData(meetup);
  expect(meetup.signupLink).toBe('https://cloudamite.com');
  expect(meetup.organizerLink).toBe('https://planbee.dev');
  expect(meetup.locationLink).toBe(
    'https://www.google.com/maps/place/Elektroniikkatie+2,+Oulu+Finland',
  );

  meetup.location = 'Kirkkokatu';
  meetup.locationLink = '';
  checkMeetupData(meetup);
  expect(meetup.locationLink).toBe(
    'https://www.google.com/maps/place/Kirkkokatu,+Oulu+Finland',
  );
});

test('short the description text', () => {
  const description =
    '         ## Great AI meetup   Join us for an evening of AI talks and discussions, while our seasoned and awesome developers' +
    ' share their experiences and insights about latest AI tools.   ## Coding helpers     - [CoPilot](https://github.com/features/copilot)  ' +
    '- [Whisperer](https://aws.amazon.com/pm/codewhisperer/)   - [Cody AI](https://about.sourcegraph.com/demo/cody)    ' +
    "There are so much more options nowadays than just github's copilot. Like Amazon's code whisperer on sourcegraph's Cody AI. " +
    'Or you can just ask chatGPT(-4).   ## Do art! With open source  Stable diffusion for the win. For images and animations. ' +
    'But what is facebook doing releasing their own models?';

  const shortDesc = createShortDescription(description);
  expect(shortDesc.length).toBe(150);
  expect(shortDesc).toBe(
    'Great AI meetup   Join us for an evening of AI talks and discussions, while our seasoned and awesome developers share their experiences and insight...',
  );
});
