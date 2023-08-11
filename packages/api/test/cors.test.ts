import { expect, test } from 'vitest';
import handler from '../src/worker';
import { testEnvVars } from './_test.env-vars';

test('Answers OPTIONS preflight request with cors stuff', async () => {
  const allowedOrigin = testEnvVars.ALLOWED_ORIGIN;

  const res = await handler.fetch(
    new Request('http://localhost:8000', {
      method: 'OPTIONS',
      headers: { Origin: allowedOrigin },
    }),
    testEnvVars,
  );

  expect(res.status).toBe(204);
  expect(res.headers.get('Access-Control-Allow-Origin')).toBe(allowedOrigin);
  expect(res.headers.get('Access-Control-Allow-Methods')).toBe(
    'POST, OPTIONS, HEAD',
  );
  expect(res.headers.get('Access-Control-Allow-Headers')).toBe(
    'Content-Type, Accept, Origin',
  );
});

test('Answers GET request with Access-Control-Allow-Origin header', async () => {
  const allowedOrigin = testEnvVars.ALLOWED_ORIGIN;

  const res = await handler.fetch(
    new Request('http://localhost:8000', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Origin: allowedOrigin,
      },
    }),
    testEnvVars,
  );

  expect(res.headers.get('Access-Control-Allow-Origin')).toBe(allowedOrigin);
});
