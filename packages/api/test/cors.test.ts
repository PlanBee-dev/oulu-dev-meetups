import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { UnstableDevWorker, unstable_dev } from 'wrangler';
import { testEnvVars } from './_test.env-vars';

describe('cors test', () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    worker = await unstable_dev('./packages/api/src/worker.ts', {
      experimental: {
        disableExperimentalWarning: true,
      },
      vars: testEnvVars,
    });
  });

  afterAll(() => {
    void worker.stop();
  });

  test('answers preflight request with cors stuff', async () => {
    const allowedOrigin = 'http://localhost:3000';

    const res = await worker.fetch('http://localhost:3000', {
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
    const res = await worker.fetch('http://localhost:3000', {
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
    const res = await worker.fetch('http://localhost:3000', {
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
});
