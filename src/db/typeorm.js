// Placeholder for TypeORM setup; user can add entities later
import { DataSource } from 'typeorm';
import { UserEntity } from '../modules/users/entities/User.entity.js';

export function createDataSource() {
	return new DataSource({
		type: process.env.DB_TYPE || 'postgres',
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT || 5432),
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		synchronize: false,
		logging: false,
		entities: [UserEntity],
	});
}


