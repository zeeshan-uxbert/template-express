import { Router } from 'express';
import { jwtGuard } from '../security/jwtGuard.js';
import { AuthController } from '../controllers/auth.controller.js';
import { features } from '../config/features.js';
import { createDataSource } from '../db/typeorm.js';
import { UserModel } from '../models/user.model.js';
import { TypeOrmUserRepository, MongooseUserRepository } from '../repositories/user.repository.js';
import { UserService } from '../services/user.service.js';

export function authRouter() {
	const r = Router();

	// Demo DI: choose repo by feature flag
	let userRepo = null;
	if (features.typeorm) {
		const ds = createDataSource();
		ds.initialize?.();
		userRepo = new TypeOrmUserRepository(ds);
	} else if (features.mongoose) {
		userRepo = new MongooseUserRepository(UserModel);
	}
	const userService = userRepo ? new UserService(userRepo) : null;

	r.post('/login', AuthController.login);
	r.post('/register', async (req, res, next) => {
		try {
			if (!userService) return res.status(501).json({ error: { code: 'NOT_ENABLED' } });
			const user = await userService.register(req.body);
			res.status(201).json({ id: user.id || user._id, email: user.email });
		} catch (e) {
			next(e);
		}
	});
	r.get('/me', jwtGuard, AuthController.me);
	return r;
}


