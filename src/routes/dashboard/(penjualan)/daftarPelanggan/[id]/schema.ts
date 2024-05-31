import { z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  npwp: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  email: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  phone: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  address: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  atasNama: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  noRekening: z.string().min(1, { message: 'Data tidak boleh kosong!' }),
  namaBank: z.string().min(1, { message: 'Data tidak boleh kosong!' })
});

export type FormSchema = typeof formSchema;
