import { count, eq } from 'drizzle-orm';
import { db } from '../../db';
import {
  CondominioIdParamsDTO,
  CreateCondominioDTO,
  UpdateCondominioDTO,
} from './condominios.dtos';
import { condominiosTable } from '../../db/schema';
import { ConflictException } from '../../errors/conflict.exception';
import { PaginationDTO } from '../../@shared/schemas';

export class CondominioService {
  async create(dto: CreateCondominioDTO) {
    const existingCondominio = await db.query.condominiosTable.findFirst({
      where: eq(condominiosTable.cnpj, dto.cnpj),
      columns: { id: true },
    });

    if (existingCondominio) {
      throw new ConflictException('CNPJ is already in use');
    }

    const [condominio] = await db
      .insert(condominiosTable)
      .values({
        razaoSocial: dto.razaoSocial,
        nomeFantasia: dto.nomeFantasia,
        cnpj: dto.cnpj,
        logradouro: dto.logradouro,
        bairro: dto.bairro,
        cidade: dto.cidade,
        cep: dto.cep,
        uf: dto.uf,
      })
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

    return condominio;
  }

  async findAll({ page, limit }: PaginationDTO) {
    const offset = (page - 1) * limit;

    const [condominios, [totalData]] = await Promise.all([
      db.query.condominiosTable.findMany({
        limit,
        offset,
        columns: {
          id: true,
          nomeFantasia: true,
          cidade: true,
          uf: true,
        },
      }),
      db.select({ count: count() }).from(condominiosTable),
    ]);

    const totalPages = Math.ceil(totalData.count / limit);

    const nextPage = page < totalPages ? page + 1 : null;

    const previousPage = page > 1 ? page - 1 : null;

    return {
      condominios,
      count: totalData.count,
      totalPages,
      previousPage,
      nextPage,
    };
  }

  async findById({ condominioId }: CondominioIdParamsDTO) {
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
    return condominio;
  }

  async update(condominioId: string, update: UpdateCondominioDTO) {
    const [condominio] = await db
      .update(condominiosTable)
      .set(update)
      .where(eq(condominiosTable.id, condominioId))
      .returning({
        id: condominiosTable.id,
      });

    return condominio;
  }

  async delete(condominioId: string) {
    const [condominio] = await db
      .delete(condominiosTable)
      .where(eq(condominiosTable.id, condominioId))
      .returning({
        id: condominiosTable.id,
      });

    return condominio;
  }
}
