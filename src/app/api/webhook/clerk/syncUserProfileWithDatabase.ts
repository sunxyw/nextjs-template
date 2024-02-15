import type { UserJSON, UserWebhookEvent } from '@clerk/nextjs/server';
import { eq, sql } from 'drizzle-orm';

import { syncUserWithPermit } from '@/app/api/webhook/clerk/syncUserWithPermit';
import { db } from '@/libs/DB';
import type { InsertUser } from '@/models/schema';
import { usersTable } from '@/models/schema';

function getDiscordIdFromUserInfo(user: UserJSON) {
  const discordAccount = user.external_accounts.find(
    (v) => v.provider === 'discord',
  );
  if (discordAccount?.verification?.status !== 'verified') {
    return null;
  }
  return discordAccount.provider_user_id;
}

function getDisplayNameFromUserInfo(user: UserJSON) {
  return (user.first_name + user.last_name).trim()
    ? `${user.first_name} ${user.last_name}`
    : user.id;
}

export async function syncUserProfileWithDatabase(evt: UserWebhookEvent) {
  if (evt.type !== 'user.created' && evt.type !== 'user.updated') {
    return;
  }

  const discordId = getDiscordIdFromUserInfo(evt.data);

  if (evt.type === 'user.created') {
    const data: InsertUser = {
      clerkId: evt.data.id,
      discordId,
      name: getDisplayNameFromUserInfo(evt.data),
      avatarUrl: evt.data.image_url,
      title: 'Freshman',
      hierarchy: 'candidate',
    };

    const insertedUser = await db
      .insert(usersTable)
      .values(data)
      .onConflictDoUpdate({
        target: usersTable.discordId,
        set: { discordId },
      })
      .returning();
    await syncUserWithPermit(insertedUser[0]!);
  } else if (evt.type === 'user.updated') {
    const profile = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, evt.data.id),
    });
    if (!profile) {
      return;
    }
    const isSyncingWithExternal =
      'isSyncingWithExternal' in profile.meta &&
      profile.meta.isSyncingWithExternal;

    let shouldDisableSyncingWithExternal = false;
    if (evt.data.has_image) {
      shouldDisableSyncingWithExternal = true;
    }
    if (getDisplayNameFromUserInfo(evt.data) !== profile.name) {
      shouldDisableSyncingWithExternal = true;
    }

    if (isSyncingWithExternal && !shouldDisableSyncingWithExternal) {
      return;
    }

    const data: Partial<InsertUser> = {
      name: getDisplayNameFromUserInfo(evt.data),
      avatarUrl: evt.data.image_url,
    };
    if (shouldDisableSyncingWithExternal) {
      // @ts-ignore --- This is magic operator of jsonb field
      data.meta = sql`jsonb_set(${usersTable.meta}, '{isSyncingWithExternal}', 'false')`;
    }
    await db.update(usersTable).set(data).where(eq(usersTable.id, profile.id));
  }
}
