import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { BaseException } from '../errors/base.exception';
import { InternalServerException } from '../errors/internal.server.exception';

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      status: 400,
      errors: error.issues.map((e) => ({
        field: e.path[0],
        message: e.message,
      })),
    });
  } else if (error instanceof BaseException) {
    return res.status(error.status).json({
      status: error.status,
      message: error.message,
    });
  }
  const err = new InternalServerException();
  return res.status(err.status).json({
    status: err.status,
    message: err.message,
  });
};
