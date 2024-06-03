import { db } from '$lib/server';
import { pemesananPembelianTable } from '$lib/server/schema/pembelian';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { penerimaanTable } from '$lib/server/schema/inventory';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const exist = await db.query.penerimaanTable.findFirst({
    where: eq(penerimaanTable.pemesananPembelianId, id)
  });

  if (exist) {
    redirect(302, '/dashboard/penerimaanBarang');
  }

  const pemesananPembelian = await db.query.pemesananPembelianTable.findFirst({
    where: eq(pemesananPembelianTable.id, id),
    columns: {
      noPembelian: true,
      tanggal: true,
      supplierId: true
    },
    with: {
      supplier: {
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

    await db.insert(penerimaanTable).values({
      id: id,
      tanggal: form.data.tanggal,
      supplierId: form.data.supplierId,
      noPelacakan: form.data.noPelacakan,
      jenis: form.data.jenis,
      noSuratJalan: form.data.noSuratJalan,
      pemesananPembelianId: form.data.id
    });

    await db
      .update(pemesananPembelianTable)
      .set({ status: 3 })
      .where(eq(pemesananPembelianTable.id, form.data.id));

    return {
      form
    };
  }
};
