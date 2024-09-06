import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Получаем __dirname для ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration(direction, migrationFile) {
  const { up, down } = await import(`./migrations/${migrationFile}`);
  console.log(`We are performing migration: ${migrationFile}`);

  if (direction === 'up') {
    await up();
  } else if (direction === 'down') {
    await down();
  }
}

async function run(direction = 'up') {
  const migrationsDir = path.resolve(__dirname, 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir);

  for (const file of migrationFiles) {
    await runMigration(direction, file);
  }

  console.log(`All migrations for ${direction} completed`);
}

run().catch((err) => console.error('Error while running migrations:', err));
