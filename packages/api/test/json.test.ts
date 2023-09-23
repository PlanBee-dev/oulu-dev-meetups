import { expect, test } from 'vitest';
import handler from '../src/worker';
import { testEnvVars } from './_test.env-vars';

test('Manages invalid json', async () => {
  const res = await handler.fetch(
    new Request('http://localhost:8000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:3000',
      },
      body: JSON.stringify({ name: 'world' }),
    }),
    testEnvVars,
  );

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({
    error: {
      message: 'Invalid JSON - validation error',
      details: [
        {
          reason: 'type',
          validation: 'string',
          origin: 'value',
          message: 'Invalid type',
          path: [{ schema: 'object', input: { name: 'world' }, key: 'title' }],
        },
        {
          reason: 'type',
          validation: 'string',
          origin: 'value',
          message: 'Invalid type',
          path: [
            { schema: 'object', input: { name: 'world' }, key: 'description' },
          ],
        },
        {
          reason: 'type',
          validation: 'string',
          origin: 'value',
          message: 'Invalid type',
          path: [{ schema: 'object', input: { name: 'world' }, key: 'date' }],
        },
        {
          reason: 'type',
          validation: 'string',
          origin: 'value',
          message: 'Invalid type',
          path: [
            { schema: 'object', input: { name: 'world' }, key: 'location' },
          ],
        },
        {
          reason: 'type',
          validation: 'string',
          origin: 'value',
          message: 'Invalid type',
          path: [
            { schema: 'object', input: { name: 'world' }, key: 'locationLink' },
          ],
        },
        {
          reason: 'type',
          validation: 'string',
          origin: 'value',
          message: 'Invalid type',
          path: [
            { schema: 'object', input: { name: 'world' }, key: 'organizer' },
          ],
        },
        {
          reason: 'type',
          validation: 'string',
          origin: 'value',
          message: 'Invalid type',
          path: [
            {
              schema: 'object',
              input: { name: 'world' },
              key: 'organizerLink',
            },
          ],
        },
        {
          reason: 'type',
          validation: 'string',
          origin: 'value',
          message: 'Invalid type',
          path: [
            { schema: 'object', input: { name: 'world' }, key: 'signupLink' },
          ],
        },
      ],
    },
  });
});

test('Manages malformed JSON', async () => {
  const res = await handler.fetch(
    new Request('http://localhost:8000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:3000',
      },
      body: '{',
    }),
    testEnvVars,
  );

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({
    error: {
      message: 'Invalid JSON - catched an error',
      details: {},
    },
  });
});
