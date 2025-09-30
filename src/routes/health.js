import { Router } from 'express';

export function healthRouter() {
  const r = Router();
  r.get('/', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), version: '1.0.0' });
  });
  return r;
}
