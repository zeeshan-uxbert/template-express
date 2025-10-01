import { Router } from 'express';

export function healthRouter() {
  const r = Router();
  /**
   * @openapi
   * /health:
   *   get:
   *     summary: Health check endpoint
   *     responses:
   *       200:
   *         description: Returns OK if the server is healthy
   */
  r.get('/', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), version: '1.0.0' });
  });
  return r;
}
