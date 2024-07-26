import { db } from '$lib/server';
import { fakturPembelianTable, pembelianProdukTable } from '$lib/server/schema/pembelian';
import { barangTable } from '$lib/server/schema/penjualan';
import { adjustStok } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { utangTable } from '$lib/server/schema/keuangan';
import { generateIdFromEntropySize } from 'lucia';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const supplier = await db.query.supplierTable.findMany();
  const barang = await db.query.barangTable.findMany({
    where: and(eq(barangTable.tipe, 1), eq(barangTable.status, 2))
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

    const subTotal = form.data.produk.reduce(
      (acc, item) => acc + Number(item.harga) * Number(item.kuantitas),
      0
    );
    const ppnTotal = form.data.ppn ? subTotal + subTotal * 0.1 : subTotal;
    const total = ppnTotal + Number(form.data.biayaKirim) + Number(form.data.biayaLainnya);

    if (!form.data.id) {
      //Add products
      await db.insert(fakturPembelianTable).values({
        id: generateIdFromEntropySize(10),
        biayaKirim: form.data.biayaKirim,
        biayaLainnya: form.data.biayaLainnya,
        catatan: form.data.catatan,
        supplierId: form.data.supplierId,
        noFaktur: form.data.noFaktur,
        tanggal: form.data.tanggal,
        userId: event.locals.user!.id,
        lampiran: form.data.lampiran,
        total: total,
        ppn: form.data.ppn
      });

      await db.insert(utangTable).values({
        id: generateIdFromEntropySize(10),
        nilai: total,
        noFaktur: form.data.noFaktur,
        sisa: total
      });

      form.data.produk.forEach(async (v) => {
        await adjustStok(1, v.kuantitas, v.barangId);

        await db.insert(pembelianProdukTable).values({
          id: v.id,
          noPembelian: form.data.noFaktur,
          harga: v.harga,
          barangId: v.barangId,
          kuantitas: v.kuantitas
        });
      });
    } else {
      // Update
      await db
        .update(fakturPembelianTable)
        .set({
          biayaKirim: form.data.biayaKirim,
          biayaLainnya: form.data.biayaLainnya,
          catatan: form.data.catatan,
          supplierId: form.data.supplierId,
          noFaktur: form.data.noFaktur,
          tanggal: form.data.tanggal,
          userId: event.locals.user!.id,
          lampiran: form.data.lampiran,
          total: total,
          ppn: form.data.ppn
        })
        .where(eq(fakturPembelianTable.id, form.data.id));

      await db
        .update(utangTable)
        .set({
          nilai: total
        })
        .where(eq(utangTable.noFaktur, form.data.id));

      const originalProducts = await db.query.pembelianProdukTable.findMany({
        where: eq(pembelianProdukTable.noPembelian, form.data.noFaktur)
      });

      const deletedProducts = originalProducts.filter(
        (op) => !form.data.produk.some((up) => up.id === op.id)
      );
      deletedProducts.forEach(async (v) => {
        await adjustStok(0, v.kuantitas, v.barangId);
        await db.delete(pembelianProdukTable).where(eq(pembelianProdukTable.id, v.id));
      });

      const updatedProducts = form.data.produk.filter((up) =>
        originalProducts.some((op) => op.id === up.id)
      );
      updatedProducts.forEach(async (v) => {
        const originalProduct = originalProducts.find((op) => op.id === v.id);

        await adjustStok(0, originalProduct!.kuantitas, originalProduct!.barangId);
        await adjustStok(1, v.kuantitas, v.barangId);

        await db
          .update(pembelianProdukTable)
          .set({
            harga: v.harga,
            barangId: v.barangId,
            kuantitas: v.kuantitas
          })
          .where(eq(pembelianProdukTable.id, v.id));
      });

      const addedProducts = form.data.produk.filter(
        (up) => !originalProducts.some((op) => op.id === up.id)
      );
      addedProducts.forEach(async (v) => {
        await adjustStok(1, v.kuantitas, v.barangId);
        await db.insert(pembelianProdukTable).values({
          id: generateIdFromEntropySize(10),
          kuantitas: v.kuantitas,
          noPembelian: form.data.noFaktur,
          harga: v.harga,
          barangId: v.barangId
        });
      });
    }

    return {
      form
    };
  }
};
