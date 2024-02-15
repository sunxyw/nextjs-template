import { Permit } from 'permitio';

import { Env } from '@/libs/Env.mjs';

export const permit = new Permit({
  pdp: 'https://cloudpdp.api.permit.io',
  token: Env.PERMIT_SDK_TOKEN,
});
