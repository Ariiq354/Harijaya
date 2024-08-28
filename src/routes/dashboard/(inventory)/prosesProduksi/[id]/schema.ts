import { z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  noProses: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  tanggal: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  bahanMentah: z
    .array(
      z.object({
        id: z.string(),
        barangId: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
        harga: z.number(),
        kuantitas: z.coerce.number(),
        tipeBarang: z.coerce.number()
      })
    )
    .min(1, { message: 'Data tidak boleh kosong!' }),
  barangJadi: z
    .array(
      z.object({
        id: z.string(),
        barangId: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
        harga: z.number(),
        kuantitas: z.coerce.number(),
        tipeBarang: z.coerce.number()
      })
    )
    .min(1, { message: 'Data tidak boleh kosong!' })
});

export type FormSchema = typeof formSchema;
