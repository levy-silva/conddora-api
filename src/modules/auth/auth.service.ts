import { UnauthorizedException } from '../../errors/unauthorized.exception';
import { usersTable } from '../../db/schema';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../../db';

export class AuthService {
  async login(email: string, password: string) {
    try {
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, email),
        columns: {
          id: true,
          email: true,
          passwordHash: true,
        },
        with: {
          role: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const passwordMatch = await compare(password, user.passwordHash);

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role?.name,
      };

      const accesstoken = sign(payload, process.env.JWT_SECRET!, {
        subject: user.id,
        expiresIn: '30m',
      });

      return { accesstoken };
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : undefined,
      );
    }
  }
}
