import { Readable } from 'node:stream';

// Adapter for Node HTTP, including servers that pre-parse JSON bodies.
export function toRequest(req) {
  const method = req.method || 'GET';
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(', ') : value);
  }
  const options = { method, headers };
  if (method !== 'GET' && method !== 'HEAD') {
    options.body = req.body === undefined ? Readable.toWeb(req) :
      typeof req.body === 'string' || Buffer.isBuffer(req.body) ? req.body : JSON.stringify(req.body);
    options.duplex = 'half';
  }
  return new Request(new URL(req.url, 'http://localhost'), options);
}

export async function sendResponse(res, response) {
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
}
