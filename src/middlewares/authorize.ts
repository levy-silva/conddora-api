import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from '../errors/forbidden.exception';

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log({ userRole: req.userRole });

    if (!req.userRole || !roles.includes(req.userRole)) {
      throw new ForbiddenException(
        "You don't have permission to access this resource",
      );
    }

    next();
  };
};
