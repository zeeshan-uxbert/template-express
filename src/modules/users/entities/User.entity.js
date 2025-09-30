import { EntitySchema } from 'typeorm';

export const UserEntity = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: { type: Number, primary: true, generated: true },
    email: { type: String, unique: true },
    passwordHash: { type: String, name: 'password_hash' },
    createdAt: { type: Date, name: 'created_at', createDate: true },
    updatedAt: { type: Date, name: 'updated_at', updateDate: true },
  },
});
