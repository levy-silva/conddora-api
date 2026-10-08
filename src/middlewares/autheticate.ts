import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      status: 401,
      message: 'Access token not provided',
    });
  }

  const [scheme, accesstoken] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !accesstoken) {
    return res.status(401).json({
      status: 401,
      message: 'Invalid authorization header',
    });
  }

  try {
    const payload = verify(accesstoken, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    req.userId = payload.id;
    req.userEmail = payload.email;
    req.userRole = payload.role;

    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: error instanceof Error && error.message,
    });
  }
};
