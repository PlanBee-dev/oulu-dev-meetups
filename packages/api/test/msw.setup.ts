import { afterAll, afterEach, beforeAll } from 'vitest';

import server from './GithubAPI.mock';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
