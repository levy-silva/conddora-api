import { Request, Response, NextFunction } from 'express';
import { NotFoundException } from '../errors/notfound.exception';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  return next(new NotFoundException());
};
