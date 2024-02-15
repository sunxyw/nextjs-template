import type { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';

import { syncUserProfileWithDatabase } from '@/app/api/webhook/clerk/syncUserProfileWithDatabase';
import { Env } from '@/libs/Env.mjs';

async function parseWebhookEvent(
  req: Request,
): Promise<WebhookEvent | undefined> {
  const secret = Env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return undefined;
  }

  // Get the headers
  const headerPayload = headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return undefined;
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(secret);

  // Verify the payload with the headers
  try {
    return wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (_) {
    return undefined;
  }
}

export async function POST(req: Request) {
  const evt = await parseWebhookEvent(req);

  if (!evt) {
    return new Response('Invalid webhook payload signature', { status: 400 });
  }

  switch (evt.type) {
    case 'user.created':
    case 'user.updated':
      await syncUserProfileWithDatabase(evt);
      break;
    default:
      break;
  }

  return new Response('', { status: 200 });
}
