import jwt from 'jsonwebtoken';

import { createDataSource } from '../../../db/typeorm.js';
import { TypeOrmUserRepository } from '../../users/repositories/user.repository.js';

const ds = createDataSource();
await ds.initialize();
const userRepo = new TypeOrmUserRepository(ds);

export const AuthController = {
  async login(req, res) {
    const user = await userRepo.getUserByEmail(req.body.email);
    if (!user) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS' } });
    }
    const token = jwt.sign({id: user.id, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
    res.json({ accessToken: token });
  },

  me(req, res) {
    res.json({ ...req.user });
  },
};
