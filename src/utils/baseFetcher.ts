import { parseISO } from 'date-fns';
import type { Middleware } from 'wretch';
import wretch from 'wretch';
import QueryStringAddon from 'wretch/addons/queryString';

import { Env } from '@/libs/Env.mjs';
import { resolveIt } from '@/utils/apiResponse';

function getBaseURL() {
  if (typeof window !== 'undefined') {
    return '';
  }
  if (process.env.NODE_ENV === 'development') {
    // noinspection HttpUrlsUsage -- this is for local development
    return `http://${Env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  return `https://${Env.NEXT_PUBLIC_VERCEL_URL}`;
}

const logMiddleware: Middleware = () => (next) => (url, opts) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`${opts.method}@${url}`);
  }
  return next(url, opts);
};

export const baseFetcher = wretch(getBaseURL())
  .addon(QueryStringAddon)
  .middlewares([logMiddleware()])
  .errorType('json')
  .resolve(async (r) => {
    // nothing to resolve for empty response
    const { status } = await r.res();
    if (status === 204 || status === 201) {
      return null;
    }

    const json = JSON.parse(await r.text(), (_key, value) => {
      // parse ISO-8601 FULL string
      if (
        typeof value === 'string' &&
        value.match(
          /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i,
        )
      ) {
        return parseISO(value);
      }
      return value;
    });

    const resolved = resolveIt(json);
    return resolved?.unwrapOr(json) ?? json;
  });
