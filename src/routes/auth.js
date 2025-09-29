import { Router } from 'express';
import { jwtGuard } from '../security/jwtGuard.js';
import { AuthController } from '../controllers/auth.controller.js';

export function authRouter() {
	const r = Router();
	r.post('/login', AuthController.login);
	r.get('/me', jwtGuard, AuthController.me);
	return r;
}


