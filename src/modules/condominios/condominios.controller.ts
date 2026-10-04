import { Request, Response, NextFunction } from 'express';
import {
  condominioIdParamsDTO,
  createCondominioDTO,
  updateCondominioDTO,
} from './condominios.dtos';
import { db } from '../../db';
import { condominiosTable } from '../../db/schema';
import { count, eq } from 'drizzle-orm';

export class CondominioController {
  async create(req: Request, res: Response, next: NextFunction) {
    const dto = createCondominioDTO.parse(req.body);

    try {
      const existingCondominio = await db.query.condominiosTable.findFirst({
        where: eq(condominiosTable.cnpj, dto.cnpj),
        columns: { id: true },
      });

      if (existingCondominio) {
        return res.status(409).json({
          status: 409,
          message: 'CNPJ is already in use',
        });
      }

      const [condominio] = await db
        .insert(condominiosTable)
        .values(dto)
        .returning({
          id: condominiosTable.id,
          razaoSocial: condominiosTable.razaoSocial,
          nomeFantasia: condominiosTable.nomeFantasia,
          cnpj: condominiosTable.cnpj,
          logradouro: condominiosTable.logradouro,
          bairro: condominiosTable.bairro,
          cidade: condominiosTable.cidade,
          uf: condominiosTable.uf,
        });

      return res.status(201).json({
        status: 201,
        data: condominio,
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const [condominios, [totalData]] = await Promise.all([
        db.query.condominiosTable.findMany({
          columns: {
            id: true,
            nomeFantasia: true,
            cidade: true,
            uf: true,
          },
        }),
        db.select({ count: count() }).from(condominiosTable),
      ]);

      return res.status(201).json({
        status: 201,
        data: condominios,
        total_data: totalData.count,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const { condominioId } = condominioIdParamsDTO.parse(req.params);

    try {
      const condominio = await db.query.condominiosTable.findFirst({
        where: eq(condominiosTable.id, condominioId),
        columns: {
          id: true,
          nomeFantasia: true,
          cnpj: true,
          logradouro: true,
          bairro: true,
          numero: true,
          complemento: true,
          cidade: true,
          cep: true,
          uf: true,
        },
      });

      if (!condominio) {
        return res.status(404).json({
          status: 404,
          message: 'Condomínio not found',
        });
      }

      return res.status(201).json({
        status: 201,
        data: condominio,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { condominioId } = condominioIdParamsDTO.parse(req.params);
    const updateDTO = updateCondominioDTO.parse(req.body);

    try {
      const [condominio] = await db
        .update(condominiosTable)
        .set(updateDTO)
        .where(eq(condominiosTable.id, condominioId))
        .returning({
          id: condominiosTable.id,
        });

      if (!condominio) {
        return res.status(404).json({
          status: 404,
          message: 'Condomínio not found',
        });
      }

      return res.status(200).json({
        status: 200,
        message: 'Condomínio updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { condominioId } = condominioIdParamsDTO.parse(req.params);

    try {
      const [condominio] = await db
        .delete(condominiosTable)
        .where(eq(condominiosTable.id, condominioId))
        .returning({
          id: condominiosTable.id,
        });

      if (!condominio) {
        return res.status(404).json({
          status: 404,
          message: 'Condomínio not found',
        });
      }

      return res.status(200).json({
        status: 200,
        message: 'Condomínio deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
