import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationName = process.argv[2];
if (!migrationName) {
  console.error('Usage: npm run typeorm:create <MigrationName>');
  process.exit(1);
}

const timestamp = Date.now();
const className = `${migrationName}${timestamp}`;
const fileName = `${timestamp}-${migrationName}.js`;
const migrationsDir = path.join(__dirname, '../db/migrations');

const template = `export class ${className} {
  name = '${className}';

  async up(queryRunner) {
    await queryRunner.query(\`
      -- Add your SQL here
    \`);
  }

  async down(queryRunner) {
    await queryRunner.query(\`
      -- Add rollback SQL here
    \`);
  }
}
`;

if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

const filePath = path.join(migrationsDir, fileName);
fs.writeFileSync(filePath, template);

console.log(`✅ Migration created: ${fileName}`);
console.log(`📝 Edit: src/db/migrations/${fileName}`);
console.log(`🔗 Don't forget to import and add to migrations array in src/db/typeorm.js`);
