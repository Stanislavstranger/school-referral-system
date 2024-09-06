/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const migrationsDir = path.resolve(__dirname, 'migrations');

async function runMigration(direction, migrationFile) {
  const migration = require(`./migrations/${migrationFile}`);
  console.log(`We are performing migration: ${migrationFile}`);

  if (direction === 'up') {
    await migration.up();
  } else if (direction === 'down') {
    await migration.down();
  }
}

async function run(direction = 'up') {
  const migrationFiles = fs.readdirSync(migrationsDir);

  for (const file of migrationFiles) {
    await runMigration(direction, file);
  }

  console.log(`All migrations for ${direction} completed`);
}

run().catch((err) => console.error('Error while running migrations:', err));
