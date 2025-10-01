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

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     summary: User login
   *     description: Logs in a user with email and password, returning an access token.
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 example: newuser@example.com
   *               password:
   *                 type: string
   *                 example: secret123
   *     responses:
   *       200:
   *         description: Successful login
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                 refreshToken:
   *                   type: string
   *       401:
   *         description: Invalid credentials
   */
  r.post('/login', AuthController.login);

  /**
   * @openapi
   * /auth/register:
   *   post:
   *     summary: User registration
   *     description: Registers a new user and returns their ID and email.
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 example: newuser@example.com
   *               password:
   *                 type: string
   *                 example: secret123
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 email:
   *                   type: string
   *       501:
   *         description: Registration not enabled
   */
  r.post('/register', async (req, res, next) => {
    try {
      if (!userService) return res.status(501).json({ error: { code: 'NOT_ENABLED' } });
      const user = await userService.register(req.body);
      res.status(201).json({ id: user.id || user._id, email: user.email });
    } catch (e) {
      next(e);
    }
  });

  /**
   * @openapi
   * /auth/me:
   *   get:
   *     summary: Get current user
   *     description: Returns details of the currently authenticated user.
   *     tags:
   *       - Auth
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current user profile
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 email:
   *                   type: string
   *       401:
   *         description: Unauthorized
   */
  r.get('/me', jwtGuard, AuthController.me);

  return r;
}
