import { z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  noStokFisik: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  tanggal: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  produkStok: z
    .array(
      z.object({
        id: z.string(),
        barangId: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
        tipe: z.coerce.number().gt(0, { message: 'Tipe tidak boleh kosong' }),
        kuantitas: z.coerce.number(),
        harga: z.number()
      })
    )
    .min(1, { message: 'Data tidak boleh kosong!' })
});

export type FormSchema = typeof formSchema;
