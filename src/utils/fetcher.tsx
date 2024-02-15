import { SignInButton } from '@clerk/nextjs';
import React from 'react';
import type { WretchError } from 'wretch';

import { ToastAction } from '@/components/ui/toast';
import { toast } from '@/components/ui/use-toast';
import { baseFetcher } from '@/utils/baseFetcher';

const HttpErrorMessageMap: Record<number, string> = {
  400: 'The server could not understand the request.',
  401: 'You are not authorized to access this resource.',
  403: 'Access to the requested resource is forbidden.',
  404: 'The requested resource could not be found.',
  422: 'The server could not process the request.',
  500: 'An internal server error occurred.',
  502: 'The server received an invalid response from an upstream server.',
  503: 'The server is currently unable to handle the request.',
  504: 'The server did not receive a timely response from an upstream server.',
} as const;

function resolveErrorMessage(error: WretchError, fallback: string): string {
  // try extract message from response
  if (error.json) {
    const { json } = error;
    // app error
    const appError = json?.error;
    if (appError && appError?.message) {
      return `${HttpErrorMessageMap[error.status]}\n\n${appError.message}`;
    }

    // zod validation error
    // eslint-disable-next-line no-underscore-dangle
    const zodErrors = json?.page?._errors ?? json?._errors;
    if (zodErrors) {
      return `${HttpErrorMessageMap[422]}\n\n${zodErrors.join('\n')}`;
    }

    // drizzle-orm error
    const drizzleError = json?.error;
    if (drizzleError) {
      const msg =
        HttpErrorMessageMap[drizzleError.status] ?? HttpErrorMessageMap[500];
      return `${msg}\n\n${drizzleError.body.message}`;
    }
  }

  // use message of http code
  return HttpErrorMessageMap[error.status] ?? fallback;
}

function toastError(message: string) {
  toast({
    variant: 'destructive',
    title: 'An error occurred while fetching data.',
    description: message,
  });
}

function toastRequireAuthentication() {
  toast({
    variant: 'destructive',
    title: 'You are not authenticated.',
    description:
      'The operation you are trying to perform requires authentication.',
    action: (
      <ToastAction asChild altText="Click the Sign in button on header">
        <SignInButton mode="modal" />
      </ToastAction>
    ),
  });
}

export const fetcher = baseFetcher.catcherFallback((error) => {
  toastError(
    resolveErrorMessage(
      error,
      'We currently have no idea what went wrong. Please contact support.',
    ),
  );

  if (error.status === 401) {
    toastRequireAuthentication();
  }

  throw error;
});
