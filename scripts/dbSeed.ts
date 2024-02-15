/* eslint-disable no-console */
import { db } from '@/libs/DB';
import { dbSeederList } from '@/models/seeders';

async function main() {
  console.log('Seeding started');

  // truncate all tables
  await Promise.all(
    Array.from(dbSeederList, async ([table]) => db.delete(table)),
  );

  // seed all tables
  await Promise.all(
    Array.from(dbSeederList, async ([table, seeder]) => {
      await db.insert(table).values(await seeder);
    }),
  );

  console.log('Seeding completed');

  process.exit(0);
}

main().catch((error) => {
  console.error('Seeding failed');
  console.log(error);
  process.exit(1);
});
