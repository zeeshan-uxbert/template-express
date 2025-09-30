import { Router } from 'express';

import { features } from '../../../config/features.js';
import { createDataSource } from '../../../db/typeorm.js';
import { jwtGuard } from '../../../security/jwtGuard.js';
import { UserModel } from '../../users/models/user.model.js';
import {
  TypeOrmUserRepository,
  MongooseUserRepository,
} from '../../users/repositories/user.repository.js';
import { UserService } from '../../users/services/user.service.js';
import { AuthController } from '../controllers/auth.controller.js';

export function authModuleRouter() {
  const r = Router();

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
