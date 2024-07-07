import { db } from '$lib/server';
import {
  barangTable,
  fakturPenjualanTable,
  penjualanProdukTable
} from '$lib/server/schema/penjualan';
import { fail } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { adjustStok, getNumber } from '$lib/server/utils';
import { piutangTable } from '$lib/server/schema/keuangan';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const pelanggan = await db.query.pelangganTable.findMany();
  const barang = await db.query.barangTable.findMany({
    where: and(eq(barangTable.tipe, 2), eq(barangTable.status, 2))
  });

  const data = await db.query.fakturPenjualanTable.findFirst({
    where: eq(fakturPenjualanTable.id, id),
    with: {
      produk: true
    }
  });

  const trx = await getNumber('SO', fakturPenjualanTable, fakturPenjualanTable.noFaktur);

  return {
    form: await superValidate(data, zod(formSchema)),
    pelanggan,
    barang,
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

    for (const [i, v] of form.data.produk.entries()) {
      const barang = await db.query.barangTable.findFirst({
        where: eq(barangTable.id, v.barangId)
      });
      const oldProduct = await db.query.penjualanProdukTable.findFirst({
        where: eq(penjualanProdukTable.id, v.id)
      });

      if (oldProduct) {
        if (oldProduct.barangId === v.barangId) {
          const diff = v.kuantitas - oldProduct.kuantitas;
          if (diff > barang!.stok) {
            return setError(
              form,
              `produk[${i}].kuantitas`,
              `Stok hanya tersisa ${barang!.stok + oldProduct.kuantitas}`
            );
          }
        }
      }

      if (v.kuantitas > barang!.stok) {
        return setError(form, `produk[${i}].kuantitas`, `Stok hanya tersisa ${barang!.stok}`);
      }
    }

    const subTotal = form.data.produk.reduce(
      (acc, item) => acc + Number(item.harga) * Number(item.kuantitas),
      0
    );
    const ppnTotal = form.data.ppn ? subTotal + subTotal * 0.1 : subTotal;
    const total = subTotal + ppnTotal;

    if (!form.data.id) {
      //Add products
      form.data.id = generateIdFromEntropySize(10);
      await db.insert(fakturPenjualanTable).values({
        id: form.data.id,
        pembulatan: form.data.pembulatan,
        biayaKirim: form.data.biayaKirim,
        biayaLainnya: form.data.biayaLainnya,
        catatan: form.data.catatan,
        pelangganId: form.data.pelangganId,
        noFaktur: form.data.noFaktur,
        tanggal: form.data.tanggal,
        userId: event.locals.user!.id,
        lampiran: form.data.lampiran,
        total: total,
        ppn: form.data.ppn
      });

      await db.insert(piutangTable).values({
        id: generateIdFromEntropySize(10),
        nilai: total,
        noFaktur: form.data.id,
        sisa: total
      });

      form.data.produk.forEach(async (v, i) => {
        v.id = generateIdFromEntropySize(10);
        await adjustStok(0, v.kuantitas, v.barangId);

        await db.insert(penjualanProdukTable).values({
          id: v.id,
          penjualanId: form.data.id,
          harga: v.harga,
          barangId: v.barangId,
          kuantitas: v.kuantitas
        });
      });
    } else {
      // Update
      await db
        .update(fakturPenjualanTable)
        .set({
          biayaKirim: form.data.biayaKirim,
          biayaLainnya: form.data.biayaLainnya,
          catatan: form.data.catatan,
          pelangganId: form.data.pelangganId,
          noFaktur: form.data.noFaktur,
          tanggal: form.data.tanggal,
          userId: event.locals.user!.id,
          lampiran: form.data.lampiran,
          total: total,
          ppn: form.data.ppn
        })
        .where(eq(fakturPenjualanTable.id, form.data.id));

      await db
        .update(piutangTable)
        .set({
          nilai: total
        })
        .where(eq(piutangTable.noFaktur, form.data.id));

      const originalProducts = await db.query.penjualanProdukTable.findMany({
        where: eq(penjualanProdukTable.penjualanId, form.data.id)
      });

      const deletedProducts = originalProducts.filter(
        (op) => !form.data.produk.some((up) => up.id === op.id)
      );
      deletedProducts.forEach(async (v) => {
        await adjustStok(1, v.kuantitas, v.barangId);
        await db.delete(penjualanProdukTable).where(eq(penjualanProdukTable.id, v.id));
      });

      const updatedProducts = form.data.produk.filter((up) =>
        originalProducts.some((op) => op.id === up.id)
      );
      updatedProducts.forEach(async (v) => {
        const originalProduct = originalProducts.find((op) => op.id === v.id);

        await adjustStok(1, originalProduct!.kuantitas, originalProduct!.barangId);
        await adjustStok(0, v.kuantitas, v.barangId);

        await db
          .update(penjualanProdukTable)
          .set({
            harga: v.harga,
            barangId: v.barangId,
            kuantitas: v.kuantitas
          })
          .where(eq(penjualanProdukTable.id, v.id));
      });

      const addedProducts = form.data.produk.filter(
        (up) => !originalProducts.some((op) => op.id === up.id)
      );
      addedProducts.forEach(async (v) => {
        await adjustStok(0, v.kuantitas, v.barangId);
        await db.insert(penjualanProdukTable).values({
          id: v.id,
          penjualanId: form.data.id,
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
