import { z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  noFaktur: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  supplierId: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  tanggal: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  biayaKirim: z.coerce.number(),
  biayaLainnya: z.coerce.number(),
  total: z.coerce.number(),
  catatan: z.string()
});

export type FormSchema = typeof formSchema;
