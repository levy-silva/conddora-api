import { count, eq } from 'drizzle-orm';
import { db } from '../../db';
import { usersTable } from '../../db/schema';
import { CreateUserDto, UpdateUserDTO, UserIdParamsDTO } from './users.dtos';
import { hash } from 'bcrypt';
import { ConflictException } from '../../errors/conflict.exception';
import { PaginationDTO } from '../../@shared/schemas';

export class UserService {
  async create(dto: CreateUserDto) {
    const existingUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, dto.email),
      columns: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Email address is already in use');
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

    return user;
  }

  async findAll({ page, limit }: PaginationDTO) {
    const offset = (page - 1) * limit;

    const [users, [totalData]] = await Promise.all([
      db.query.usersTable.findMany({
        limit,
        offset,
        columns: {
          id: true,
          name: true,
          email: true,
        },
      }),
      db.select({ count: count() }).from(usersTable),
    ]);

    const totalPages = Math.ceil(totalData.count / limit);

    const nextPage = page < totalPages ? page + 1 : null;

    const previousPage = page > 1 ? page - 1 : null;

    return {
      users,
      count: totalData.count,
      totalPages,
      previousPage,
      nextPage,
    };
  }

  async findById({ userId }: UserIdParamsDTO) {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
      },
    });

    return user;
  }

  async update(userId: string, update: UpdateUserDTO) {
    const [user] = await db
      .update(usersTable)
      .set(update)
      .where(eq(usersTable.id, userId))
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      });

    return user;
  }

  async delete(userId: string) {
    const [user] = await db
      .delete(usersTable)
      .where(eq(usersTable.id, userId))
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      });

    return user;
  }
}
