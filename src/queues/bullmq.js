import { Queue, Worker } from 'bullmq';

export function createQueue(name = 'default') {
	const connection = process.env.REDIS_URL || 'redis://localhost:6379';
	return new Queue(name, { connection });
}

export function createWorker(name = 'default', processor) {
	const connection = process.env.REDIS_URL || 'redis://localhost:6379';
	return new Worker(name, processor, { connection });
}


