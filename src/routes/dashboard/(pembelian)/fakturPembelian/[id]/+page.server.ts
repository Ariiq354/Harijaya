import { db } from '$lib/server';
import { fakturPemesananTable, pemesananPembelianTable } from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const exist = await db.query.fakturPemesananTable.findFirst({
    where: eq(fakturPemesananTable.pemesananId, id)
  });

  if (exist) {
    redirect(302, '/dashboard/fakturPembelian');
  }

  const pemesananPembelian = await db.query.pemesananPembelianTable.findFirst({
    where: eq(pemesananPembelianTable.id, id),
    with: {
      supplier: {
        columns: {
          address: true,
          email: true,
          name: true,
          atasNama: true,
          noRekening: true,
          namaBank: true
        }
      },
      produk: {
        with: {
          barang: {
            columns: {
              name: true,
              harga: true,
              satuan: true
            }
          }
        }
      }
    }
  });

  return {
    form: await superValidate(zod(formSchema)),
    pemesananPembelian,
    id
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    const id = generateIdFromEntropySize(10);

    await db
      .insert(fakturPemesananTable)
      .values({
        id: id,
        total: form.data.total,
        pemesananId: form.data.id,
        supplierId: form.data.supplierId,
        catatan: form.data.catatan,
        biayaKirim: form.data.biayaKirim,
        biayaLainnya: form.data.biayaLainnya,
        noFaktur: form.data.noFaktur,
        tanggal: form.data.tanggal
      })
      .onConflictDoUpdate({
        target: fakturPemesananTable.id,
        set: {
          catatan: form.data.catatan,
          total: form.data.total,
          pemesananId: form.data.id,
          supplierId: form.data.supplierId,
          biayaKirim: form.data.biayaKirim,
          biayaLainnya: form.data.biayaLainnya,
          noFaktur: form.data.noFaktur,
          tanggal: form.data.tanggal
        }
      });

    await db
      .update(pemesananPembelianTable)
      .set({ status: 2 })
      .where(eq(pemesananPembelianTable.id, form.data.id));

    return {
      form
    };
  }
};
