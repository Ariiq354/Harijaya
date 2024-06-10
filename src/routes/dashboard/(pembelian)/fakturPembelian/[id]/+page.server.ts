import { db } from '$lib/server';
import { fakturPembelianTable, pembelianProdukTable } from '$lib/server/schema/pembelian';
import { fail } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { barangTable } from '$lib/server/schema/penjualan';
import { stokBahanMentahTable } from '$lib/server/schema/inventory';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const supplier = await db.query.supplierTable.findMany();
  const barang = await db.query.barangTable.findMany({
    where: eq(barangTable.tipe, 1)
  });
  const data = await db.query.fakturPembelianTable.findFirst({
    where: eq(fakturPembelianTable.id, id),
    with: {
      produk: true
    }
  });

  return {
    form: await superValidate(data, zod(formSchema)),
    supplier,
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
      .insert(fakturPembelianTable)
      .values({
        id: form.data.id,
        biayaKirim: form.data.biayaKirim,
        biayaLainnya: form.data.biayaLainnya,
        catatan: form.data.catatan,
        supplierId: form.data.supplierId,
        noFaktur: form.data.noFaktur,
        tanggal: form.data.tanggal,
        userId: event.locals.user!.id,
        lampiran: form.data.lampiran,
        total: form.data.total,
        ppn: form.data.ppn
      })
      .onConflictDoUpdate({
        target: fakturPembelianTable.id,
        set: {
          id: form.data.id,
          biayaKirim: form.data.biayaKirim,
          biayaLainnya: form.data.biayaLainnya,
          catatan: form.data.catatan,
          supplierId: form.data.supplierId,
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
          .update(stokBahanMentahTable)
          .set({
            stok: sql<number>`${stokBahanMentahTable.stok} + ${v.kuantitas}`
          })
          .where(eq(stokBahanMentahTable.barangId, v.barangId!));
      } else {
        const stock = await db.query.pembelianProdukTable.findFirst({
          where: eq(pembelianProdukTable.id, v.id)
        });
        const diff = v.kuantitas - stock!.kuantitas;
        if (diff !== 0) {
          await db.update(stokBahanMentahTable).set({
            stok: sql<number>`${stokBahanMentahTable.stok} + (${diff})`
          });
        }
      }
      await db
        .insert(pembelianProdukTable)
        .values({
          id: v.id,
          pembelianId: form.data.id,
          harga: v.harga,
          barangId: v.barangId,
          kuantitas: v.kuantitas
        })
        .onConflictDoUpdate({
          target: pembelianProdukTable.id,
          set: {
            harga: v.harga,
            pembelianId: form.data.id,
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
