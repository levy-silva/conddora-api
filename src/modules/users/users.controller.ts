import { Request, Response, NextFunction } from 'express';

import { createUserDTO, updateUserDTO, userIdParamsDTO } from './users.dtos';
import { NotFoundException } from '../../errors/notfound.exception';
import { paginationSchema } from '../../@shared/schemas';
import { UserService } from './users.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    const dto = createUserDTO.parse(req.body);

    try {
      const user = await this.userService.create({
        name: dto.name,
        email: dto.email,
        password: dto.password,
      });

      return res.status(201).json({
        status: 201,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = paginationSchema.parse(req.query);

    try {
      const data = await this.userService.findAll({ page, limit });

      return res.status(200).json({
        status: 200,
        data: data.users,
        meta: {
          totalItems: data.count,
          totalPages: data.totalPages,
          currentPage: page,
          previousPage: data.previousPage,
          nextPage: data.nextPage,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    const dto = userIdParamsDTO.parse(req.params);

    try {
      const user = await this.userService.findById({ userId: dto.userId });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return res.status(200).json({
        status: 200,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = userIdParamsDTO.parse(req.params);
    const updateDTO = updateUserDTO.parse(req.body);

    try {
      const user = await this.userService.update(userId, updateDTO);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return res.status(200).json({
        status: 200,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = userIdParamsDTO.parse(req.params);

    try {
      const user = await this.userService.delete(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return res.status(200).json({
        status: 200,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
