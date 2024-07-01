import { z } from 'zod';

export const formSchema = z.object({
  total: z.coerce.number(),
  piutang: z
    .array(
      z.object({
        piutangId: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
        nilai: z.coerce.number()
      })
    )
    .min(1, { message: 'Data tidak boleh kosong!' })
});

export type FormSchema = typeof formSchema;
