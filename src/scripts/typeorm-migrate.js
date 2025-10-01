import { createDataSource } from '../db/typeorm.js';

async function run() {
  const direction = process.argv[2] || 'up';
  const ds = createDataSource();
  await ds.initialize();
  try {
    if (direction === 'down') {
      await ds.undoLastMigration();
      console.log('Migration reverted');
    } else {
      await ds.runMigrations();
      console.log('Migrations applied');
    }
  } finally {
    await ds.destroy();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
