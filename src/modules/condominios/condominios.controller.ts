import { NextFunction, Request, Response } from 'express';

import { NotFoundException } from '../../errors/notfound.exception';
import { CondominioService } from './condominios.service';
import { paginationSchema } from '../../@shared/schemas';

import {
  condominioIdParamsDTO,
  createCondominioDTO,
  updateCondominioDTO,
} from './condominios.dtos';

export class CondominioController {
  constructor(private readonly condominioService: CondominioService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    const dto = createCondominioDTO.parse(req.body);

    try {
      const condominio = await this.condominioService.create({
        razaoSocial: dto.razaoSocial,
        nomeFantasia: dto.nomeFantasia,
        cnpj: dto.cnpj,
        logradouro: dto.logradouro,
        bairro: dto.bairro,
        cidade: dto.cidade,
        cep: dto.cep,
        uf: dto.uf,
      });

      return res.status(201).json({
        status: 201,
        data: condominio,
      });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = paginationSchema.parse(req.query);

    try {
      const data = await this.condominioService.findAll({ page, limit });

      return res.status(201).json({
        status: 201,
        data: data.condominios,
        meta: {
          totalItems: data.count,
          currentPage: page,
          totalPages: data.totalPages,
          previousPage: data.previousPage,
          nextPage: data.nextPage,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    const { condominioId } = condominioIdParamsDTO.parse(req.params);

    try {
      const condominio = await this.condominioService.findById({
        condominioId,
      });

      if (!condominio) {
        throw new NotFoundException('Condomínio not found');
      }

      return res.status(201).json({
        status: 201,
        data: condominio,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const { condominioId } = condominioIdParamsDTO.parse(req.params);
    const updateDTO = updateCondominioDTO.parse(req.body);

    try {
      const condominio = await this.condominioService.update(
        condominioId,
        updateDTO,
      );

      if (!condominio) {
        throw new NotFoundException('Condomínio not found');
      }

      return res.status(200).json({
        status: 200,
        message: 'Condomínio updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const { condominioId } = condominioIdParamsDTO.parse(req.params);

    try {
      const condominio = await this.condominioService.delete(condominioId);

      if (!condominio) {
        throw new NotFoundException('Condomínio not found');
      }

      return res.status(200).json({
        status: 200,
        message: 'Condomínio deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
