import { Request } from '@cloudflare/workers-types';

export function isPreflight(req: Request) {
  return req.method === 'OPTIONS';
}

export function getCorsHeaders(allowedOrigin: string) {
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
  };
}
