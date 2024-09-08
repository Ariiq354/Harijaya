import { z } from 'zod';

export const formSchema = z.object({
  year: z.string().min(1, { message: 'Data tidak boleh kosong!' }).nullable(),
  month: z.string().min(1, { message: 'Data tidak boleh kosong!' }).nullable(),
  period: z.string().min(1, { message: 'Data tidak boleh kosong!' }).nullable(),
  noAkun: z.string().min(1, { message: 'Data tidak boleh kosong!' }).nullable()
});

export type FormSchema = typeof formSchema;
