/* eslint-disable no-console */
import { db } from '@/libs/DB';
import { Env } from '@/libs/Env.mjs';
import type { InsertUser } from '@/models/schema';
import { usersTable } from '@/models/schema';
import { baseFetcher } from '@/utils/baseFetcher';

export type DiscordGuildMember = {
  avatar?: string;
  joined_at: string;
  nick?: string;
  pending: boolean;
  premium_since?: string;
  roles: string[];
  user: {
    id: string;
    username: string;
    avatar?: string;
    bot?: boolean;
    global_name?: string;
  };
};

export type DiscordGuildRole = {
  id: string;
  name: string;
};

function shouldBeImported(data: DiscordGuildMember): boolean {
  return (
    !data.user.bot &&
    !data.roles.includes('801014086086164496') && // 影分身
    (data.roles.includes('567270209702985729') || // 認證成員
      data.roles.includes('708602758135021638')) // 正式成員
  );
}

function resolveTitle(roles: DiscordGuildRole[]): string {
  const weightedRoleMatchList = [
    '最佳會員',
    'Talk Shit之星',
    '最佳紳士',
    '王牌導師',
    '變態之鬼',
    '圖片創作大師',
    '元老',
    '贊助',
    '學霸',
    '紳士',
    '夢想少年',
    '成員',
  ];

  for (const role of weightedRoleMatchList) {
    for (const userRole of roles) {
      if (userRole.name.includes(role)) {
        return userRole.name;
      }
    }
  }
  return '';
}

function resolveHierarchy(roles: DiscordGuildRole[]) {
  if (roles.find((role) => role.id === '1160635635988693092')) {
    // 元老
    return 'core';
  }
  if (roles.find((role) => role.id === '708602758135021638')) {
    // 正式成員
    return 'official';
  }
  if (roles.find((role) => role.id === '567270209702985729')) {
    // 認證成員
    return 'verified';
  }
  return 'candidate';
}

function convertToMemberProfile(
  data: DiscordGuildMember,
  rolesDef: DiscordGuildRole[],
): InsertUser {
  const roles: DiscordGuildRole[] = data.roles
    .map((roleId) => rolesDef.find((role) => role.id === roleId))
    .filter((role) => role !== undefined) as DiscordGuildRole[];

  return {
    discordId: data.user.id,
    name: data.nick ?? data.user.global_name ?? data.user.username,
    avatarUrl: `https://cdn.discordapp.com/avatars/${data.user.id}/${
      data.avatar ?? data.user.avatar
    }.webp?size=128`,
    title: resolveTitle(roles),
    hierarchy: resolveHierarchy(roles),
  };
}

async function upsertMemberProfile(profile: InsertUser) {
  await db.insert(usersTable).values(profile).onConflictDoUpdate({
    target: usersTable.discordId,
    set: profile,
  });
}

export async function importMembershipDataFromExportedData(
  exportedData: DiscordGuildMember[],
  rolesDef: DiscordGuildRole[],
) {
  const importData = exportedData
    .filter(shouldBeImported)
    .map((data) => convertToMemberProfile(data, rolesDef));
  const promises = importData.map(upsertMemberProfile);
  await Promise.all(promises);
}

export async function importMembershipDataFromDiscord() {
  const exportedData = (await baseFetcher
    .url(
      'https://discord.com/api/v10/guilds/567268233263185922/members?limit=100',
      true,
    )
    .headers({
      Authorization: `Bot ${Env.DISCORD_API_TOKEN}`,
    })
    .get()) as DiscordGuildMember[];

  const rolesDef = (await baseFetcher
    .url('https://discord.com/api/v10/guilds/567268233263185922/roles', true)
    .headers({
      Authorization: `Bot ${Env.DISCORD_API_TOKEN}`,
    })
    .get()) as DiscordGuildRole[];

  await importMembershipDataFromExportedData(exportedData, rolesDef);
}
