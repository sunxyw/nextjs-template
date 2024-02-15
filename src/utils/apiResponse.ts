import { DrizzleError } from 'drizzle-orm';
import type { Result } from 'neverthrow';
import { err, ok } from 'neverthrow';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

function transformError(error: unknown): { status: number; payload: unknown } {
  if (error instanceof ZodError) {
    return {
      status: 422,
      payload: {
        message: error.issues[0]?.message ?? error.message,
        type: 'ValidationError',
        details: error.issues,
      },
    };
  }
  if (error instanceof DrizzleError) {
    return {
      status: 500,
      payload: {
        message: error.message,
        type: 'DatabaseError',
        details: error,
      },
    };
  }
  if (error instanceof Error) {
    return {
      status: 500,
      payload: {
        message: error.message,
        type: 'GenericError',
        details: error,
      },
    };
  }
  if (typeof error === 'string') {
    return {
      status: 500,
      payload: {
        message: error,
        type: 'GenericError',
        details: error,
      },
    };
  }
  return {
    status: 500,
    payload: error,
  };
}

export function returnIt(result: Result<unknown, unknown>) {
  if (result.isOk()) {
    return NextResponse.json({
      data: result.value,
      error: null,
    });
  }
  const transformedError = transformError(result.error);
  return NextResponse.json(
    {
      data: null,
      error: transformedError.payload,
    },
    {
      status: transformedError.status,
    },
  );
}

export function resolveIt(json: unknown): Result<unknown, unknown> | undefined {
  // convert json back to result
  if (json && typeof json === 'object') {
    const { data, error } = json as {
      data: unknown;
      error: unknown;
    };
    if (error) {
      return err(error);
    }
    return ok(data);
  }
  return undefined;
}
