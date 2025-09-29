export class CreateUsers1700000000000 {
	name = 'CreateUsers1700000000000';

	async up(queryRunner) {
		await queryRunner.query(`
			CREATE TABLE IF NOT EXISTS users (
				id SERIAL PRIMARY KEY,
				email VARCHAR(255) UNIQUE NOT NULL,
				password_hash VARCHAR(255) NOT NULL,
				created_at TIMESTAMP NOT NULL DEFAULT NOW(),
				updated_at TIMESTAMP NOT NULL DEFAULT NOW()
			);
		`);
		await queryRunner.query(`
			CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email);
		`);
	}

	async down(queryRunner) {
		await queryRunner.query('DROP TABLE IF EXISTS users;');
	}
}


