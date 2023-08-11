export function isPreflight(req: Request) {
  return req.method === 'OPTIONS';
}

export function createPreflightResponse(allowedOrigin: string) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS, HEAD',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Origin',
    },
  });
}

export function setCorsHeaders(
  req: Request,
  res: Response,
  allowedOrigin: string,
) {
  if (req.method === 'GET') {
    res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  }
}
