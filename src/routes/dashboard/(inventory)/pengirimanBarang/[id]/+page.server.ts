import { db } from '$lib/server';
import { pemesananPenjualanTable } from '$lib/server/schema/penjualan';
import { fail, redirect } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { pengirimanTable } from '$lib/server/schema/inventory';
import { getNumber } from '$lib/server/utils';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const exist = await db.query.pengirimanTable.findFirst({
    where: eq(pengirimanTable.pemesananPenjualanId, id)
  });

  if (exist) {
    redirect(302, '/dashboard/pengirimanBarang');
  }

  const pemesananPenjualan = await db.query.pemesananPenjualanTable.findFirst({
    where: eq(pemesananPenjualanTable.id, id),
    columns: {
      noPenjualan: true,
      tanggal: true,
      pelangganId: true
    },
    with: {
      pelanggan: {
        columns: {
          address: true,
          email: true,
          name: true
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

  const trx = await getNumber('DO', pengirimanTable, pengirimanTable.noSuratJalan);

  return {
    form: await superValidate(zod(formSchema)),
    pemesananPenjualan,
    id,
    trx
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

    await db.insert(pengirimanTable).values({
      id: id,
      pemesananPenjualanId: form.data.id,
      pelangganId: form.data.pelangganId,
      tanggal: form.data.tanggal,
      noPelacakan: form.data.noPelacakan,
      jenis: form.data.jenis,
      noSuratJalan: form.data.noSuratJalan
    });

    await db
      .update(pemesananPenjualanTable)
      .set({ status: sql<number>`${pemesananPenjualanTable.status} + 2` })
      .where(eq(pemesananPenjualanTable.id, form.data.id));

    return {
      form
    };
  }
};
