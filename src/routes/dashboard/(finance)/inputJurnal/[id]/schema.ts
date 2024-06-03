import { z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  kodeTransaksi: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  tanggal: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  noReferensi: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  nominal: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  deskripsi: z.string(),
  akunDebit: z.string().min(1, { message: 'Data tidak boleh kosong!' }).nullable(),
  akunKredit: z.string().min(1, { message: 'Data tidak boleh kosong!' }).nullable()
});

export type FormSchema = typeof formSchema;
