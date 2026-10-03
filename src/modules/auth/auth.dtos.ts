import z from 'zod';

export const authLoginDTO = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type AuthLoginDTO = z.infer<typeof authLoginDTO>;
