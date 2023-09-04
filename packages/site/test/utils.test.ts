import { getRandomLogonumber, parseMeetupDate } from '../src/utils';
import { expect, test } from 'vitest';

test('random randomnumber returns number between 1-5', () => {
  for (let i = 0; i < 100; i++) {
    const randomNumber: number = getRandomLogonumber();
    expect(randomNumber).toBeGreaterThanOrEqual(1);
    expect(randomNumber).toBeLessThanOrEqual(5);
  }
});

test('date parsing works in user format', () => {
  const userDate = '2023-08-25 17:00';
  const parsedDate = parseMeetupDate(userDate);
  expect(parsedDate).toBeDefined();
  expect(parsedDate).not.toBeNull();
  if (parsedDate) {
    expect(new Date(parsedDate).toLocaleString()).toBe('8/25/2023, 5:00:00 PM');
  }
});

test('date parsing works in system format', () => {
  const systemDate = 'Wed, 13 Sep 2023 16:30:00 GMT';
  const parsedDate = parseMeetupDate(systemDate);
  expect(parsedDate).toBeDefined();
  expect(parsedDate).not.toBeNull();
  if (parsedDate) {
    expect(new Date(parsedDate).toLocaleString()).toBe('9/13/2023, 7:30:00 PM');
  }
});
