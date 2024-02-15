// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import * as Spotlight from '@spotlightjs/spotlight';

Sentry.init({
  dsn: 'https://512a0c1ae5aa6662c200699183bf7ec8@o4506100443119616.ingest.sentry.io/4506558785912832',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  spotlight: process.env.NODE_ENV === 'development',

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),

    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: 'system',
    }),
  ],

  beforeSend(event) {
    // Check if it is an exception, and if so, show the report dialog
    if (event.exception && event.event_id) {
      Sentry.showReportDialog({ eventId: event.event_id });
    }
    return event;
  },
});

if (process.env.NODE_ENV === 'development') {
  Spotlight.init();
}
