import { logger } from '../setup/logger.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } });
}

export function errorHandler(err, req, res) {
  logger.error('Unhandled error', { err });
  const status = err.status || err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Internal server error';
  res.status(status).json({ success: false, error: { code, message } });
}
