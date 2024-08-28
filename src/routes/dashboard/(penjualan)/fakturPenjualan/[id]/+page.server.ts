import { db } from '$lib/server/database';
import { piutangTable } from '$lib/server/database/schema/keuangan';
import {
  barangHargaTable,
  barangTable,
  fakturPenjualanTable,
  penjualanProdukTable
} from '$lib/server/database/schema/penjualan';
import { updateStokUseCase } from '$lib/server/use-cases/stok';
import { getNumber } from '$lib/server/common';
import { fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

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
      const barang = await db.query.barangHargaTable.findFirst({
        where: and(eq(barangHargaTable.barangId, v.barangId), eq(barangHargaTable.harga, v.harga))
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
      await db.insert(fakturPenjualanTable).values({
        id: generateIdFromEntropySize(10),
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
        await updateStokUseCase(v.barangId, -v.kuantitas, v.harga);

        await db.insert(penjualanProdukTable).values({
          id: v.id,
          noPenjualan: form.data.noFaktur,
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
        where: eq(penjualanProdukTable.noPenjualan, form.data.noFaktur)
      });

      const deletedProducts = originalProducts.filter(
        (op) => !form.data.produk.some((up) => up.id === op.id)
      );
      deletedProducts.forEach(async (v) => {
        await updateStokUseCase(v.barangId, v.kuantitas, v.harga);
        await db.delete(penjualanProdukTable).where(eq(penjualanProdukTable.id, v.id));
      });

      const updatedProducts = form.data.produk.filter((up) =>
        originalProducts.some((op) => op.id === up.id)
      );
      updatedProducts.forEach(async (v) => {
        const originalProduct = originalProducts.find((op) => op.id === v.id);

        await updateStokUseCase(
          originalProduct!.barangId,
          originalProduct!.kuantitas,
          originalProduct!.harga
        );
        await updateStokUseCase(v.barangId, -v.kuantitas, v.harga);

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
        await updateStokUseCase(v.barangId, -v.kuantitas, v.harga);
        await db.insert(penjualanProdukTable).values({
          id: v.id,
          noPenjualan: form.data.noFaktur,
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
