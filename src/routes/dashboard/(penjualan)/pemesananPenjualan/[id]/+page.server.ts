import { db } from '$lib/server';
import { pemesananPenjualanTable, penjualanProdukTable } from '$lib/server/schema';
import { currentDate } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import { eq, like, sql } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  let trx;
  const pelanggan = await db.query.pelangganTable.findMany();
  const barang = await db.query.barangTable.findMany();
  const data = await db.query.pemesananPenjualanTable.findFirst({
    where: eq(pemesananPenjualanTable.id, id),
    with: {
      produk: true
    }
  });

  if (!data) {
    const num = await db
      .select({
        num: sql<string>`
        CASE
          WHEN MAX(CAST(SUBSTR(${pemesananPenjualanTable.noPenjualan}, -3) AS INTEGER)) ISNULL then '001'
          ELSE SUBSTR('00' || (MAX(CAST(SUBSTR(${pemesananPenjualanTable.noPenjualan}, -3) AS INTEGER)) + 1), -3)
        END`
      })
      .from(pemesananPenjualanTable)
      .where(
        like(pemesananPenjualanTable.noPenjualan, sql`'SO-' || strftime('%Y%m%d', 'now') || '-%'`)
      );

    trx = 'SO-' + currentDate() + '-' + num[0].num;
  } else {
    trx = data.noPenjualan;
  }

  return {
    form: await superValidate(data, zod(formSchema)),
    pelanggan,
    trx,
    barang
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

    if (!form.data.id) {
      form.data.id = generateIdFromEntropySize(10);
    }

    await db
      .insert(pemesananPenjualanTable)
      .values({
        id: form.data.id,
        pelangganId: form.data.pelangganId,
        noPenjualan: form.data.noPenjualan,
        tanggal: form.data.tanggal,
        userId: event.locals.user!.id,
        lampiran: form.data.lampiran,
        total: form.data.total,
        pembulatan: form.data.pembulatan,
        ppn: form.data.ppn
      })
      .onConflictDoUpdate({
        target: pemesananPenjualanTable.id,
        set: {
          pelangganId: form.data.pelangganId,
          noPenjualan: form.data.noPenjualan,
          tanggal: form.data.tanggal,
          userId: event.locals.user!.id,
          lampiran: form.data.lampiran,
          total: form.data.total,
          pembulatan: form.data.pembulatan,
          ppn: form.data.ppn
        }
      });

    form.data.produk.forEach(async (v) => {
      if (!v.id) {
        v.id = generateIdFromEntropySize(10);
      }

      await db
        .insert(penjualanProdukTable)
        .values({
          id: v.id,
          penjualanId: form.data.id,
          barangId: v.barangId,
          kuantitas: v.kuantitas
        })
        .onConflictDoUpdate({
          target: penjualanProdukTable.id,
          set: {
            penjualanId: form.data.id,
            barangId: v.barangId,
            kuantitas: v.kuantitas
          }
        });
    });

    return {
      form
    };
  }
};
