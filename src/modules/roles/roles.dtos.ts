import z from 'zod';

export const createRoleDTO = z.object({
  name: z
    .string()
    .trim()
    .min(5, 'O nome deve ter no mínimo 5 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres')
    .transform((value) => value.toUpperCase()),

  description: z
    .string()
    .trim()
    .min(10, 'A descrição dev ter no mínimo 10 caracteres')
    .max(100, 'A descrição deve ter no máximo 100 caracteres')
    .optional(),
});

export const updateRoleDTO = createRoleDTO.partial();

export const roleIdParamsDTO = z.object({
  roleId: z.uuid(),
});

export type CreateRoleDTO = z.infer<typeof createRoleDTO>;
export type UpdateRoleDTO = z.infer<typeof updateRoleDTO>;
export type RoleIdParamsDTO = z.infer<typeof roleIdParamsDTO>;
