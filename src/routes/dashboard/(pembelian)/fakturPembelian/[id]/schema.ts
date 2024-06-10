import { z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  supplierId: z.string().min(1, { message: 'Data tidak boleh kosong!' }).nullable(),
  noFaktur: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  tanggal: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  lampiran: z.string(),
  catatan: z.string(),
  total: z.coerce.number(),
  ppn: z.boolean(),
  biayaKirim: z.coerce.number(),
  biayaLainnya: z.coerce.number(),
  produk: z
    .object({
      id: z.string(),
      barangId: z.string().min(1, { message: 'Data tidak boleh kosong!' }).nullable(),
      kuantitas: z.coerce.number().gt(0, { message: 'Data tidak boleh kosong!' }),
      harga: z.coerce.number().gt(0, { message: 'Data tidak boleh kosong!' })
    })
    .array()
    .min(1, { message: 'Data tidak boleh kosong!' })
});

export type FormSchema = typeof formSchema;
