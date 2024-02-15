import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

enum RouteType {
  UNKNOWN = 0,

  API_READONLY = 1 << 0,
  API_READWRITE = 1 << 1,
  API = API_READONLY | API_READWRITE,

  PAGE = 1 << 2,
}

enum RouteAccess {
  PUBLIC = 1 << 0, // anyone
  AUTHENTICATED = 1 << 1, // normal user
  REGISTERED = 1 << 2, // membership
  PRIVILEGED = 1 << 3, // moderator
}

function getRouteType(req: NextRequest): RouteType {
  if (req.nextUrl.pathname.startsWith('/api')) {
    return (
      RouteType.API |
      (req.method === 'GET' ? RouteType.API_READONLY : RouteType.API_READWRITE)
    );
  }

  return req.method === 'GET' ? RouteType.PAGE : RouteType.UNKNOWN;
}

function isRouteType(req: NextRequest, type: RouteType): boolean {
  return (getRouteType(req) & type) === type;
}

function getRouteAccess(req: NextRequest): RouteAccess {
  const type = getRouteType(req);
  switch (true) {
    case (type & RouteType.PAGE) === RouteType.PAGE:
    case (type & RouteType.API_READONLY) === RouteType.API_READONLY:
      return RouteAccess.PUBLIC;
    case (type & RouteType.API_READWRITE) === RouteType.API_READWRITE:
      return RouteAccess.AUTHENTICATED;
    case (type & RouteType.UNKNOWN) === RouteType.UNKNOWN:
    default:
      return RouteAccess.PUBLIC;
  }
}

export default authMiddleware({
  publicRoutes: (req: NextRequest) =>
    getRouteAccess(req) === RouteAccess.PUBLIC,
  apiRoutes: (req: NextRequest) => isRouteType(req, RouteType.API),

  beforeAuth: (req) => {
    // Execute next-intl middleware before Clerk's auth middleware
    if (isRouteType(req, RouteType.PAGE)) {
      return intlMiddleware(req);
    }
    return undefined;
  },

  afterAuth(auth, req) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      if (auth.isApiRoute) {
        return NextResponse.json(
          { error: { message: 'Unauthorized' } },
          { status: 401 },
        );
      }
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    // If the user is logged in and trying to access a protected route, allow them to access route
    if (auth.userId && !auth.isPublicRoute) {
      return NextResponse.next();
    }
    // Allow users visiting public routes to access them
    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
