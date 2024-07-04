import { z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  noTransaksi: z.string(),
  totalNilai: z.coerce.number(),
  piutangItem: z
    .array(
      z.object({
        id: z.string(),
        noPiutang: z.string().nullable(),
        nilai: z.coerce.number()
      })
    )
    .min(1, { message: 'Data tidak boleh kosong!' })
});

export type FormSchema = typeof formSchema;
