import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { usersTable } from '@/models/schema';

export async function getUserIdFromClerkId(
  clerkId: string | null,
): Promise<string | undefined> {
  if (!clerkId) {
    return undefined;
  }
  const user = await db.query.usersTable.findFirst({
    columns: { id: true },
    where: eq(usersTable.clerkId, clerkId),
  });
  return user?.id;
}

export async function getCurrentUserId(): Promise<string | undefined> {
  const { userId: clerkId } = auth();
  return getUserIdFromClerkId(clerkId);
}
