import { Request, Response, NextFunction } from 'express';
import { createRoleDTO, roleIdParamsDTO, updateRoleDTO } from './roles.dtos';
import { db } from '../../db';
import { rolesTable } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { count } from 'drizzle-orm';

export class RoleController {
  async create(req: Request, res: Response, next: NextFunction) {
    const dto = createRoleDTO.parse(req.body);
    try {
      const existingRole = await db.query.rolesTable.findFirst({
        where: eq(rolesTable.name, dto.name),
      });

      if (existingRole) {
        return res.status(409).json({
          status: 409,
          message: 'A role with this name already exists.',
        });
      }

      const [role] = await db.insert(rolesTable).values(dto).returning({
        id: rolesTable.id,
        name: rolesTable.name,
        description: rolesTable.description,
      });

      return res.status(201).json({
        status: 201,
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const [roles, [totalData]] = await Promise.all([
        db.query.rolesTable.findMany({
          columns: {
            id: true,
            name: true,
            description: true,
          },
        }),
        db.select({ count: count() }).from(rolesTable),
      ]);

      return res.status(200).json({
        status: 200,
        data: roles,
        total_data: totalData.count,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const { roleId } = roleIdParamsDTO.parse(req.params);

    try {
      const role = await db.query.rolesTable.findFirst({
        where: eq(rolesTable.id, roleId),
        columns: {
          id: true,
          name: true,
          description: true,
        },
      });

      if (!role) {
        return res.status(404).json({
          status: 404,
          message: 'Role not found',
        });
      }

      return res.status(201).json({
        status: 201,
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { roleId } = roleIdParamsDTO.parse(req.params);
    const updateDTO = updateRoleDTO.parse(req.body);

    try {
      const [role] = await db
        .update(rolesTable)
        .set(updateDTO)
        .where(eq(rolesTable.id, roleId))
        .returning({
          id: rolesTable.id,
          name: rolesTable.name,
          description: rolesTable.description,
        });

      if (!role) {
        return res.status(404).json({
          status: 404,
          message: 'Role not found',
        });
      }

      return res.status(201).json({
        status: 200,
        message: 'Role deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { roleId } = roleIdParamsDTO.parse(req.params);

    try {
      const [role] = await db
        .delete(rolesTable)
        .where(eq(rolesTable.id, roleId))
        .returning({
          id: rolesTable.id,
        });

      if (!role) {
        return res.status(404).json({
          status: 404,
          message: 'Role not found',
        });
      }

      return res.status(201).json({
        status: 200,
        message: 'Role deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
