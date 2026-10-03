import { Request, Response, NextFunction } from 'express';
import { createUserDTO, updateUserDTO, userIdParamsDTO } from './users.dtos';
import { usersTable } from '../../db/schema';
import { hash } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { count } from 'drizzle-orm';

export class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    const dto = createUserDTO.parse(req.body);

    try {
      const existingUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, dto.email),
        columns: { id: true },
      });

      if (existingUser) {
        return res.status(409).json({
          status: 409,
          message: 'Email address is already in use',
        });
      }
      const passwordHash = await hash(dto.password, 10);

      const [user] = await db
        .insert(usersTable)
        .values({
          name: dto.name,
          email: dto.email,
          passwordHash,
        })
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        });

      return res.status(201).json({
        status: 201,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const [users, [totalData]] = await Promise.all([
        db.query.usersTable.findMany({
          columns: {
            id: true,
            name: true,
            email: true,
          },
        }),
        db.select({ count: count() }).from(usersTable),
      ]);

      return res.status(200).json({
        status: 200,
        data: users,
        total_data: totalData.count,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const dto = userIdParamsDTO.parse(req.params);

    try {
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, dto.userId),
        columns: {
          id: true,
          name: true,
          email: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          status: 404,
          message: 'User not found',
        });
      }

      return res.status(200).json({
        status: 200,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { userId } = userIdParamsDTO.parse(req.params);
    const updateDTO = updateUserDTO.parse(req.body);

    try {
      const [updatedUser] = await db
        .update(usersTable)
        .set(updateDTO)
        .where(eq(usersTable.id, userId))
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        });

      if (!updatedUser) {
        return res.status(404).json({
          status: 404,
          message: 'User not found',
        });
      }

      return res.status(200).json({
        status: 200,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const dto = userIdParamsDTO.parse(req.params);

    try {
      const [deletedUser] = await db
        .delete(usersTable)
        .where(eq(usersTable.id, dto.userId))
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
        });

      if (!deletedUser) {
        return res.status(404).json({
          status: 404,
          message: 'User not found',
        });
      }

      return res.status(200).json({
        status: 200,
        data: deletedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}
