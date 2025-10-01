import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';

// Adds a request id to req.id and X-Request-Id header
export function requestId() {
  return (req, res, next) => {
    const incoming = req.headers['x-request-id'];
    const id = typeof incoming === 'string' && incoming.length ? incoming : uuidv4();
    req.id = id;
    res.setHeader('X-Request-Id', id);
    next();
  };
}

// Register a morgan token for request id
morgan.token('id', (req) => req.id || '-');
