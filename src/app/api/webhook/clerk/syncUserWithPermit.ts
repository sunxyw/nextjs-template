import { permit } from '@/libs/permit';
import type { SelectUser } from '@/models/schema';

export async function syncUserWithPermit(user: SelectUser) {
  const payload = {
    key: user.id,
  };
  await permit.api.syncUser(payload);
}
