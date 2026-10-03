import z from 'zod';

export const createUserDTO = z.object({
  name: z.string().min(3).max(255),
  email: z.email(),
  password: z.string().min(6),
});

export const updateUserDTO = createUserDTO.partial();

export const userIdParamsDTO = z.object({
  userId: z.uuidv7(),
});

export type CreateUserDto = z.infer<typeof createUserDTO>;
export type UpdateUserDTO = z.infer<typeof updateUserDTO>;
export type UserIdParamsDTO = z.infer<typeof userIdParamsDTO>;
