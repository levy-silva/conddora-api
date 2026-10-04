import { Request, Response, NextFunction } from 'express';
import { authLoginDTO } from './auth.dtos';
import { usersTable } from '../../db/schema';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { db } from '../../db';
import { eq } from 'drizzle-orm';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = authLoginDTO.parse(req.body);

    try {
      const existingUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
        columns: {
          id: true,
          email: true,
          passwordHash: true,
        },
      });

      if (!existingUser) {
        return res.status(401).json({
          status: 401,
          message: 'Invalid email or password',
        });
      }

      const passwordMatch = await compare(password, existingUser.passwordHash);

      if (!passwordMatch) {
        return res.status(401).json({
          status: 401,
          message: 'Invalid email or password',
          result: passwordMatch,
          password: existingUser.passwordHash,
        });
      }

      const payload = {
        id: existingUser.id,
        email: existingUser.email,
      };

      const accesstoken = sign(payload, process.env.JWT_SECRET!, {
        subject: existingUser.id,
        expiresIn: '30m',
      });

      return res.status(200).json({
        status: 200,
        accesstoken,
      });
    } catch (error) {
      next(error);
    }
  }
}
