import { parseEnv } from './workerEnv';
import { handleRequest } from './workerHandler';
import { getCorsHeaders, isPreflight } from './workerCors';

const handler = {
  async fetch(req: Request, unsafeEnv: unknown): Promise<Response> {
    const envResult = await parseEnv(unsafeEnv);

    if (envResult.errorResponse) {
      return envResult.errorResponse;
    }
    const env = envResult.env;

    const corsHeaders = getCorsHeaders(env.ALLOWED_ORIGIN);

    if (isPreflight(req)) {
      return new Response(undefined, { status: 204, headers: corsHeaders });
    }

    const response = await handleRequest(req, env);

    Object.entries(corsHeaders).forEach((keyVal) =>
      response.headers.set(keyVal[0], keyVal[1]),
    );

    return response;
  },
};

export default handler;
