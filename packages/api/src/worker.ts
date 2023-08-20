import {
  createPreflightResponse,
  isPreflight,
  setCorsHeaders,
} from './workerCors';
import { parseEnv } from './workerEnv';
import { handleRequest } from './workerHandler';

const handler = {
  async fetch(req: Request, unsafeEnv: unknown): Promise<Response> {
    const envResult = await parseEnv(unsafeEnv);

    if ('errorResponse' in envResult) {
      return envResult.errorResponse;
    }
    const env = envResult.env;

    if (isPreflight(req)) {
      return createPreflightResponse(env.ALLOWED_ORIGIN);
    }

    const res = await handleRequest(req, env);

    setCorsHeaders(req, res, env.ALLOWED_ORIGIN);

    return res;
  },
};

export default handler;
