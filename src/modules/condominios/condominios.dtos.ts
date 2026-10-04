import z from 'zod';

export const createCondominioDTO = z.object({
  razaoSocial: z
    .string()
    .trim()
    .min(15, 'A Razão Social deve ter no mínimo 15 caracteres')
    .max(255, 'A Razão Social deve ter no máximo 255 caracteres'),

  nomeFantasia: z
    .string()
    .trim()
    .min(5, 'O Nome Fantasia deve ter no mínimo 5 caracteres')
    .max(255, 'O Nome Fantasia deve ter no máximo 255 caracteres'),

  cnpj: z
    .string()
    .transform((value) => value.replace(/\D/g, ''))
    .pipe(z.string().length(14, 'O CNPJ deve conter 14 números')),

  logradouro: z
    .string()
    .trim()
    .min(3, 'O Logradouro deve ter no mínimo 3 caracteres')
    .max(255, 'O Logradouro deve ter no máximo 255 caracteres'),

  bairro: z
    .string()
    .trim()
    .min(2, 'O Bairro deve ter no mínimo 2 caracteres')
    .max(255, 'O Bairro deve ter no máximo 255 caracteres'),

  numero: z
    .string()
    .trim()
    .max(10, 'O Número deve ter no máximo 10 caracteres')
    .optional(),

  complemento: z
    .string()
    .trim()
    .max(255, 'O Complemento deve ter no máximo 255 caracteres')
    .optional(),

  cidade: z
    .string()
    .trim()
    .min(2, 'A Cidade deve ter no mínimo 2 caracteres')
    .max(255, 'A Cidade deve ter no máximo 255 caracteres'),

  cep: z
    .string()
    .transform((value) => value.replace(/\D/g, ''))
    .pipe(z.string().length(8, 'O CEP deve conter 8 números')),

  uf: z
    .string()
    .trim()
    .length(2, 'A UF deve conter exatamente 2 caracteres')
    .regex(/^[A-Za-z]{2}$/, 'A UF deve conter apenas letras')
    .transform((value) => value.toUpperCase()),
});

export const updateCondominioDTO = createCondominioDTO.partial();

export const condominioIdParamsDTO = z.object({
  condominioId: z.uuid(),
});

export type CreateCondominioDTO = z.infer<typeof createCondominioDTO>;
export type UpdateCondominioDTO = z.infer<typeof updateCondominioDTO>;
export type CondominioIdParamsDTO = z.infer<typeof condominioIdParamsDTO>;
