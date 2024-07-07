import { z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  supplierId: z.string().nullable(),
  noFaktur: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  tanggal: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  lampiran: z.string(),
  catatan: z.string(),
  ppn: z.boolean(),
  biayaKirim: z.coerce.number(),
  biayaLainnya: z.coerce.number(),
  produk: z
    .array(
      z.object({
        id: z.string(),
        barangId: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
        kuantitas: z.coerce.number(),
        harga: z.coerce.number()
      })
    )
    .min(1, { message: 'Data tidak boleh kosong!' })
});

export type FormSchema = typeof formSchema;
