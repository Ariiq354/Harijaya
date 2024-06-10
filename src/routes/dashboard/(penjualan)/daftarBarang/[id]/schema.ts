import { z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  tipe: z.coerce.number().gt(0, { message: 'Data tidak boleh kosong!' }),
  deskripsi: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  satuan: z.string().min(1, { message: 'Data tidak boleh kosong!' })
});

export type FormSchema = typeof formSchema;
