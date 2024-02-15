/* eslint-disable no-console */
import type {
  DiscordGuildMember,
  DiscordGuildRole,
} from '@/app/api/webhook/qstash/importMembershipDataFromDiscord';
import { importMembershipDataFromExportedData } from '@/app/api/webhook/qstash/importMembershipDataFromDiscord';

async function main() {
  const exportedFile = './tmpDiscordMembers.json';
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const exportedData: DiscordGuildMember[] = require(exportedFile);
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const rolesDef: DiscordGuildRole[] = require('./tmpDiscordRoles.json');

  await importMembershipDataFromExportedData(exportedData, rolesDef);

  console.log('Done!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
