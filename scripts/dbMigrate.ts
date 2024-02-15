/* eslint-disable no-console */
import { migrate } from 'drizzle-orm/neon-serverless/migrator';

import { db } from '@/libs/DB';

async function main() {
  console.log('Migration started');

  await migrate(db, {
    migrationsFolder: './migrations',
  });

  console.log('Migration completed');

  process.exit(0);
}

main().catch((error) => {
  console.error('Migration failed');
  console.log(error);
  process.exit(1);
});
