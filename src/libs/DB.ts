import * as schema from '@/models/schema';

import { Env } from './Env.mjs';
import {createClient} from "@libsql/client";
import {drizzle} from "drizzle-orm/libsql";

const client = createClient({
  url: Env.DATABASE_URL,
  authToken: Env.DATABASE_AUTH_TOKEN,
})

export const db = drizzle(client, { schema });
