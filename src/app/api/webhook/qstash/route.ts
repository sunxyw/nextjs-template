import * as Sentry from '@sentry/nextjs';
import { verifySignatureAppRouter } from '@upstash/qstash/dist/nextjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { importMembershipDataFromDiscord } from '@/app/api/webhook/qstash/importMembershipDataFromDiscord';

async function handler(req: NextRequest) {
  const payload = await req.json();

  try {
    switch (payload.name) {
      case 'members.sync.discord':
        await importMembershipDataFromDiscord();
        break;
      default:
        break;
    }
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { success: false, name: payload.name },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, name: payload.name });
}

export const POST = verifySignatureAppRouter(handler);
