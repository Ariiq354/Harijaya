import { db } from '$lib/server';
import { fakturPenjualanTable, pemesananPenjualanTable } from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const exist = await db.query.fakturPenjualanTable.findFirst({
    where: eq(fakturPenjualanTable.penjualanId, id)
  });

  if (exist) {
    redirect(302, '/dashboard/fakturPenjualan');
  }

  const pemesananPenjualan = await db.query.pemesananPenjualanTable.findFirst({
    where: eq(pemesananPenjualanTable.id, id),
    with: {
      pelanggan: {
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
    pemesananPenjualan,
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
      .insert(fakturPenjualanTable)
      .values({
        id: id,
        total: form.data.total,
        penjualanId: form.data.id,
        pelangganId: form.data.pelangganId,
        catatan: form.data.catatan,
        biayaKirim: form.data.biayaKirim,
        biayaLainnya: form.data.biayaLainnya,
        pembulatan: form.data.pembulatan,
        noFaktur: form.data.noFaktur,
        tanggal: form.data.tanggal
      })
      .onConflictDoUpdate({
        target: fakturPenjualanTable.id,
        set: {
          total: form.data.total,
          penjualanId: form.data.id,
          pelangganId: form.data.pelangganId,
          catatan: form.data.catatan,
          biayaKirim: form.data.biayaKirim,
          biayaLainnya: form.data.biayaLainnya,
          pembulatan: form.data.pembulatan,
          noFaktur: form.data.noFaktur,
          tanggal: form.data.tanggal
        }
      });

    await db
      .update(pemesananPenjualanTable)
      .set({ status: 2 })
      .where(eq(pemesananPenjualanTable.id, form.data.id));

    return {
      form
    };
  }
};
