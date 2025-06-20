import { expect, test } from 'vitest';
import handler from '../src/worker';
import { testEnvVars } from './_test.env-vars';

test('Manages invalid json', async () => {
  const res = await handler.fetch(
    new Request('http://localhost:8000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:4321',
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
          kind: 'schema',
          type: 'object',
          expected: '"title"',
          received: 'undefined',
          message: 'Invalid key: Expected "title" but received undefined',
          path: [
            {
              type: 'object',
              origin: 'key',
              input: {
                name: 'world',
              },
              key: 'title',
            },
          ],
        },
        {
          kind: 'schema',
          type: 'object',
          expected: '"description"',
          received: 'undefined',
          message: 'Invalid key: Expected "description" but received undefined',
          path: [
            {
              type: 'object',
              origin: 'key',
              input: {
                name: 'world',
              },
              key: 'description',
            },
          ],
        },
        {
          kind: 'schema',
          type: 'object',
          expected: '"date"',
          received: 'undefined',
          message: 'Invalid key: Expected "date" but received undefined',
          path: [
            {
              type: 'object',
              origin: 'key',
              input: {
                name: 'world',
              },
              key: 'date',
            },
          ],
        },
        {
          kind: 'schema',
          type: 'object',
          expected: '"location"',
          received: 'undefined',
          message: 'Invalid key: Expected "location" but received undefined',
          path: [
            {
              type: 'object',
              origin: 'key',
              input: {
                name: 'world',
              },
              key: 'location',
            },
          ],
        },
        {
          kind: 'schema',
          type: 'object',
          expected: '"locationLink"',
          received: 'undefined',
          message:
            'Invalid key: Expected "locationLink" but received undefined',
          path: [
            {
              type: 'object',
              origin: 'key',
              input: {
                name: 'world',
              },
              key: 'locationLink',
            },
          ],
        },
        {
          kind: 'schema',
          type: 'object',
          expected: '"organizer"',
          received: 'undefined',
          message: 'Invalid key: Expected "organizer" but received undefined',
          path: [
            {
              type: 'object',
              origin: 'key',
              input: {
                name: 'world',
              },
              key: 'organizer',
            },
          ],
        },
        {
          kind: 'schema',
          type: 'object',
          expected: '"organizerLink"',
          received: 'undefined',
          message:
            'Invalid key: Expected "organizerLink" but received undefined',
          path: [
            {
              type: 'object',
              origin: 'key',
              input: {
                name: 'world',
              },
              key: 'organizerLink',
            },
          ],
        },
        {
          kind: 'schema',
          type: 'object',
          expected: '"signupLink"',
          received: 'undefined',
          message: 'Invalid key: Expected "signupLink" but received undefined',
          path: [
            {
              type: 'object',
              origin: 'key',
              input: {
                name: 'world',
              },
              key: 'signupLink',
            },
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
        Origin: 'http://localhost:4321',
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
