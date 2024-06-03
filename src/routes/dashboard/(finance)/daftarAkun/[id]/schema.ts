import { z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  kode: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  nama: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  kategori: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  deskripsi: z.string()
});

export type FormSchema = typeof formSchema;
