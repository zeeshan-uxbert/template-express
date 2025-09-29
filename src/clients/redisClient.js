import { createClient } from 'redis';

export async function createRedis() {
	const url = process.env.REDIS_URL || 'redis://localhost:6379';
	const client = createClient({ url });
	client.on('error', (err) => console.error('Redis error', err));
	await client.connect();
	return client;
}


