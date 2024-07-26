import { z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  kodeTransaksi: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  tanggal: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  noReferensi: z.string().min(1, { message: 'Data tidak boleh kosong!' }).nullable(),
  nominal: z.coerce.number(),
  deskripsi: z.string(),
  noAkun: z.string().min(1, { message: 'Data tidak boleh kosong!' }).nullable()
});

export type FormSchema = typeof formSchema;
