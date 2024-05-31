import { db } from '$lib/server';
import { pemasokTable, pemesananPembelianTable, pemesananProdukTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { eq, like, sql } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { currentDate } from '$lib/utils';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  let trx;
  const supplier = await db.query.pemasokTable.findMany();
  const barang = await db.query.barangTable.findMany();
  const data = await db.query.pemesananPembelianTable.findFirst({
    where: eq(pemesananPembelianTable.id, id),
    with: {
      produk: true
    }
  });

  if (!data) {
    const num = await db
      .select({
        num: sql<string>`
        CASE
          WHEN MAX(CAST(SUBSTR(${pemesananPembelianTable.noPemesanan}, -3) AS INTEGER)) ISNULL then '001'
          ELSE SUBSTR('00' || (MAX(CAST(SUBSTR(${pemesananPembelianTable.noPemesanan}, -3) AS INTEGER)) + 1), -3)
        END`
      })
      .from(pemesananPembelianTable)
      .where(
        like(pemesananPembelianTable.noPemesanan, sql`'PO-' || strftime('%Y%m%d', 'now') || '-%'`)
      );

    trx = 'PO-' + currentDate() + '-' + num[0].num;
  } else {
    trx = data.noPemesanan;
  }

  return {
    form: await superValidate(data, zod(formSchema)),
    supplier,
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
      .insert(pemesananPembelianTable)
      .values({
        id: form.data.id,
        supplierId: form.data.supplierId,
        noPemesanan: form.data.noPemesanan,
        tanggal: form.data.tanggal,
        userId: event.locals.user!.id,
        lampiran: form.data.lampiran,
        total: form.data.total,
        ppn: form.data.ppn
      })
      .onConflictDoUpdate({
        target: pemesananPembelianTable.id,
        set: {
          supplierId: form.data.supplierId,
          noPemesanan: form.data.noPemesanan,
          tanggal: form.data.tanggal,
          userId: event.locals.user!.id,
          lampiran: form.data.lampiran,
          total: form.data.total,
          ppn: form.data.ppn
        }
      });

    form.data.produk.forEach(async (v) => {
      if (!v.id) {
        v.id = generateIdFromEntropySize(10);
      }

      await db
        .insert(pemesananProdukTable)
        .values({
          id: v.id,
          pemesananId: form.data.id,
          barangId: v.barangId,
          kuantitas: v.kuantitas
        })
        .onConflictDoUpdate({
          target: pemesananProdukTable.id,
          set: {
            pemesananId: form.data.id,
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
