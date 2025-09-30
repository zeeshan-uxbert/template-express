import { createRedis } from '../clients/redisClient.js';
import { features } from '../config/features.js';
import { connectMongoose } from '../db/mongoose.js';
import { createDataSource } from '../db/typeorm.js';
import { logger } from '../setup/logger.js';

export async function load(optionals = {}) {
  const loaded = {};

  if (features.typeorm) {
    loaded.sql = createDataSource();
    await loaded.sql.initialize();
    logger.info('TypeORM initialized');
  }

  if (features.mongoose) {
    loaded.mongo = await connectMongoose();
    logger.info('Mongoose connected');
  }

  if (features.redis || features.bullmq) {
    loaded.redis = await createRedis();
    logger.info('Redis connected');
  }

  return { ...loaded, ...optionals };
}
