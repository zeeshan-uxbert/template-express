// Repository interface
export class UserRepository {
	async createUser(input) { throw new Error('Not implemented'); }
	async getUserByEmail(email) { throw new Error('Not implemented'); }
}

// TypeORM implementation
export class TypeOrmUserRepository extends UserRepository {
	constructor(dataSource) {
		super();
		this.repo = dataSource.getRepository('User');
	}

	async createUser({ email, passwordHash }) {
		const user = this.repo.create({ email, passwordHash });
		return await this.repo.save(user);
	}

	async getUserByEmail(email) {
		return await this.repo.findOne({ where: { email } });
	}
}

// Mongoose implementation
export class MongooseUserRepository extends UserRepository {
	constructor(userModel) {
		super();
		this.User = userModel;
	}

	async createUser({ email, passwordHash }) {
		return await this.User.create({ email, passwordHash });
	}

	async getUserByEmail(email) {
		return await this.User.findOne({ email }).exec();
	}
}


