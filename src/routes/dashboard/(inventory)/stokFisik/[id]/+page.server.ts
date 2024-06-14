import { db } from '$lib/server';
import { stokFisikProdukTable, stokFisikTable } from '$lib/server/schema/inventory';
import { barangTable } from '$lib/server/schema/penjualan';
import { adjustStok } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const barang = await db.query.barangTable.findMany({
    where: eq(barangTable.status, 2)
  });
  const data = await db.query.stokFisikTable.findFirst({
    where: eq(stokFisikTable.id, id),
    with: {
      produkStok: true
    }
  });

  return {
    form: await superValidate(data, zod(formSchema)),
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

    form.data.produk.forEach(async (v, i) => {
      if (v.tipe === 0) {
        const barang = await db.query.barangTable.findFirst({
          where: eq(barangTable.id, v.barangId)
        });
        const oldProduct = await db.query.stokFisikProdukTable.findFirst({
          where: eq(stokFisikProdukTable.id, v.id)
        });

        if (oldProduct) {
          if (oldProduct.barangId === v.barangId) {
            const diff = v.kuantitas - oldProduct.kuantitas;
            if (diff > barang!.stok) {
              return setError(form, `produk[${i}].kuantitas`, 'Stok tidak mencukupi');
            }
          }
        }

        if (v.kuantitas > barang!.stok) {
          return setError(form, `produk[${i}].kuantitas`, 'Stok tidak mencukupi');
        }
      }
    });

    if (!form.data.id) {
      //Add products
      form.data.id = generateIdFromEntropySize(10);
      await db.insert(stokFisikTable).values({
        id: form.data.id,
        noStokFisik: form.data.noStokFisik,
        tanggal: form.data.tanggal
      });

      form.data.produk.forEach(async (v) => {
        v.id = generateIdFromEntropySize(10);
        await adjustStok(v.tipe, v.kuantitas, v.barangId);
        await db.insert(stokFisikProdukTable).values({
          id: v.id,
          stokFisikId: form.data.id,
          barangId: v.barangId,
          kuantitas: v.kuantitas,
          tipe: v.tipe
        });
      });
    } else {
      // Update
      await db
        .update(stokFisikTable)
        .set({
          noStokFisik: form.data.noStokFisik,
          tanggal: form.data.tanggal
        })
        .where(eq(stokFisikTable.id, form.data.id));

      const originalProducts = await db.query.stokFisikProdukTable.findMany({
        where: eq(stokFisikProdukTable.stokFisikId, form.data.id)
      });

      const deletedProducts = originalProducts.filter(
        (op) => !form.data.produk.some((up) => up.id === op.id)
      );
      deletedProducts.forEach(async (v) => {
        await adjustStok(v.tipe === 0 ? 1 : 0, v.kuantitas, v.barangId);
        await db.delete(stokFisikProdukTable).where(eq(stokFisikProdukTable.id, v.id));
      });

      const updatedProducts = form.data.produk.filter((up) =>
        originalProducts.some((op) => op.id === up.id)
      );
      updatedProducts.forEach(async (v) => {
        const originalProduct = originalProducts.find((op) => op.id === v.id);

        await adjustStok(
          v.tipe === 0 ? 1 : 0,
          originalProduct!.kuantitas,
          originalProduct!.barangId
        );
        await adjustStok(v.tipe, v.kuantitas, v.barangId);

        await db
          .update(stokFisikProdukTable)
          .set({
            barangId: v.barangId,
            kuantitas: v.kuantitas,
            tipe: v.tipe
          })
          .where(eq(stokFisikProdukTable.id, v.id));
      });

      const addedProducts = form.data.produk.filter(
        (up) => !originalProducts.some((op) => op.id === up.id)
      );
      addedProducts.forEach(async (v) => {
        await adjustStok(v.tipe, v.kuantitas, v.barangId);
        await db.insert(stokFisikProdukTable).values({
          id: generateIdFromEntropySize(10),
          tipe: v.tipe,
          stokFisikId: form.data.id,
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
