import { expect, test } from 'vitest';

test('answers preflight request with cors stuff', async () => {
  const allowedOrigin = 'http://localhost:3000';

  const res = await fetch('http://127.0.0.1:8787', {
    method: 'OPTIONS',
    headers: { origin: allowedOrigin },
  });

  expect(res.status).toBe(204);
  expect(res.headers.get('Access-Control-Allow-Origin')).toBe(allowedOrigin);
  expect(res.headers.get('Access-Control-Allow-Methods')).toBe(
    'POST, OPTIONS, HEAD',
  );
  expect(res.headers.get('Access-Control-Allow-Headers')).toBe(
    'Content-Type, Accept, Origin',
  );
});

test('Invalid json', async () => {
  const res = await fetch('http://127.0.0.1:8787', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'world' }),
  });

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({
    error: {
      message: 'Invalid JSON - schema parsing failed',
      details: {
        date: ['Required'],
        description: ['Required'],
        location: ['Required'],
        locationLink: ['Required'],
        organizer: ['Required'],
        organizerLink: ['Required'],
        signupLink: ['Required'],
        time: ['Required'],
        title: ['Required'],
      },
    },
  });
});

test('Malformed JSON', async () => {
  const res = await fetch('http://127.0.0.1:8787', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{',
  });

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({
    error: {
      message: 'Invalid JSON - catched an error',
      details: {},
    },
  });
});
