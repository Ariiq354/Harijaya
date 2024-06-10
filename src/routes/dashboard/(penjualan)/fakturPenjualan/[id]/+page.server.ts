import { db } from '$lib/server';
import { stokBarangJadiTable } from '$lib/server/schema/inventory';
import {
  barangTable,
  fakturPenjualanTable,
  penjualanProdukTable
} from '$lib/server/schema/penjualan';
import { fail } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const pelanggan = await db.query.pelangganTable.findMany();
  const barang = await db.query.barangTable.findMany({
    where: eq(barangTable.tipe, 2)
  });
  const data = await db.query.fakturPenjualanTable.findFirst({
    where: eq(fakturPenjualanTable.id, id),
    with: {
      produk: true
    }
  });

  return {
    form: await superValidate(data, zod(formSchema)),
    pelanggan,
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
      .insert(fakturPenjualanTable)
      .values({
        id: form.data.id,
        biayaKirim: form.data.biayaKirim,
        biayaLainnya: form.data.biayaLainnya,
        catatan: form.data.catatan,
        pelangganId: form.data.pelangganId,
        noFaktur: form.data.noFaktur,
        pembulatan: form.data.pembulatan,
        tanggal: form.data.tanggal,
        userId: event.locals.user!.id,
        lampiran: form.data.lampiran,
        total: form.data.total,
        ppn: form.data.ppn
      })
      .onConflictDoUpdate({
        target: fakturPenjualanTable.id,
        set: {
          id: form.data.id,
          biayaKirim: form.data.biayaKirim,
          biayaLainnya: form.data.biayaLainnya,
          catatan: form.data.catatan,
          pembulatan: form.data.pembulatan,
          pelangganId: form.data.pelangganId,
          noFaktur: form.data.noFaktur,
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
        await db
          .update(stokBarangJadiTable)
          .set({
            stok: sql<number>`${stokBarangJadiTable.stok} - ${v.kuantitas}`
          })
          .where(eq(stokBarangJadiTable.barangId, v.barangId!));
      } else {
        const stock = await db.query.penjualanProdukTable.findFirst({
          where: eq(penjualanProdukTable.id, v.id)
        });
        const diff = v.kuantitas - stock!.kuantitas;
        if (diff !== 0) {
          await db.update(stokBarangJadiTable).set({
            stok: sql<number>`${stokBarangJadiTable.stok} - (${diff})`
          });
        }
      }
      await db
        .insert(penjualanProdukTable)
        .values({
          id: v.id,
          penjualanId: form.data.id,
          harga: v.harga,
          barangId: v.barangId,
          kuantitas: v.kuantitas
        })
        .onConflictDoUpdate({
          target: penjualanProdukTable.id,
          set: {
            harga: v.harga,
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
