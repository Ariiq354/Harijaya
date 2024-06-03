import { z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  noSuratJalan: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  supplierId: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  tanggal: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  noPelacakan: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  jenis: z.string().min(1, { message: 'Data tidak boleh kosong!' })
});

export type FormSchema = typeof formSchema;
