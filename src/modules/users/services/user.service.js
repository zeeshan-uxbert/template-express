import bcrypt from 'bcrypt';

export class UserService {
	constructor(userRepository) {
		this.userRepository = userRepository;
	}

	async register({ email, password }) {
		const existing = await this.userRepository.getUserByEmail(email);
		if (existing) throw Object.assign(new Error('Email already in use'), { status: 409 });
		const passwordHash = await bcrypt.hash(password, 10);
		return await this.userRepository.createUser({ email, passwordHash });
	}
}


