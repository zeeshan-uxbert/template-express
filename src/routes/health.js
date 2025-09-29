import { Router } from 'express';
import { HealthController } from '../controllers/health.controller.js';

export function healthRouter() {
	const r = Router();
	r.get('/', HealthController.status);
	return r;
}


