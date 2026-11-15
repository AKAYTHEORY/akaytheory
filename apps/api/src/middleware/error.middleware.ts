import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ApiErrorProblemDetails } from '@akaytheory/shared';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly title: string;

  constructor(statusCode: number, code: string, title: string, detail: string) {
    super(detail);
    this.statusCode = statusCode;
    this.code = code;
    this.title = title;
  }
}

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const timestamp = new Date().toISOString();
  const instance = req.originalUrl || req.url;

  if (err instanceof ZodError) {
    const problem: ApiErrorProblemDetails = {
      success: false,
      type: 'urn:akaytheory:error:validation',
      title: 'Validation Error',
      status: 400,
      code: 'VALIDATION_FAILED',
      detail: 'The submitted request payload failed schema validation.',
      instance,
      invalidParams: err.errors.map((e) => ({
        name: e.path.join('.'),
        reason: e.message,
      })),
      timestamp,
    };
    res.status(400).json(problem);
    return;
  }

  if (err instanceof AppError) {
    const problem: ApiErrorProblemDetails = {
      success: false,
      type: `urn:akaytheory:error:${err.code.toLowerCase()}`,
      title: err.title,
      status: err.statusCode,
      code: err.code,
      detail: err.message,
      instance,
      timestamp,
    };
    res.status(err.statusCode).json(problem);
    return;
  }

  // Fallback internal server error
  console.error('[UNHANDLED_ERROR]', err);
  const problem: ApiErrorProblemDetails = {
    success: false,
    type: 'urn:akaytheory:error:internal',
    title: 'Internal Server Error',
    status: 500,
    code: 'INTERNAL_SERVER_ERROR',
    detail: 'An unexpected internal error occurred on the server.',
    instance,
    timestamp,
  };
  res.status(500).json(problem);
}

