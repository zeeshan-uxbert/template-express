import { Router } from 'express';

export function healthRouter() {
<<<<<<< HEAD
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
=======
  const r = Router();
  r.get('/', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), version: '1.0.0' });
  });
  return r;
>>>>>>> 0cca3f937f2c2bc88da6a3faaa0ad7c839049e57
}
