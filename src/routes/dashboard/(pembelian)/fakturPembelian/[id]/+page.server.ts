import { db } from '$lib/server';
import { fakturPembelianTable, pembelianProdukTable } from '$lib/server/schema/pembelian';
import { barangTable } from '$lib/server/schema/penjualan';
import { adjustStok } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

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

    if (!form.data.id) {
      //Add products
      form.data.id = generateIdFromEntropySize(10);
      await db.insert(fakturPembelianTable).values({
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
      });

      form.data.produk.forEach(async (v) => {
        v.id = generateIdFromEntropySize(10);
        await adjustStok(1, v.kuantitas, v.barangId);

        await db.insert(pembelianProdukTable).values({
          id: v.id,
          pembelianId: form.data.id,
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
          total: form.data.total,
          ppn: form.data.ppn
        })
        .where(eq(fakturPembelianTable.id, form.data.id));

      const originalProducts = await db.query.pembelianProdukTable.findMany({
        where: eq(pembelianProdukTable.pembelianId, form.data.id)
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
          pembelianId: form.data.id,
          harga: v.harga,
          barangId: v.barangId,
          kuantitas: v.kuantitas
        });
      });
    }

    return {
      form
    };
  }
};
