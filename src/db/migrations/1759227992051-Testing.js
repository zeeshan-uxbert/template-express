export class Testing1759227992051 {
  name = 'Testing1759227992051';

  async up(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE users ADD COLUMN testing VARCHAR(255);
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE users DROP COLUMN testing;
    `);
  }
}
