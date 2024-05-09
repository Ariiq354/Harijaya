import { z } from 'zod';

export const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Username minimal 2 karakter' })
    .max(50, { message: 'Username maksimal 50 karakter' }),
  password: z.string().min(8, { message: 'Password minimal 8 karakter' })
});

export type FormSchema = typeof formSchema;
