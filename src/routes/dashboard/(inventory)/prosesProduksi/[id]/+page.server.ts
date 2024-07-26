import { db } from '$lib/server';
import { prosesProdukTable, prosesTable } from '$lib/server/schema/inventory';
import { barangTable } from '$lib/server/schema/penjualan';
import { fail } from '@sveltejs/kit';
import { and, eq, gt, sql } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { adjustStok, getNumber } from '$lib/server/utils';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const bahanMentah = await db.query.barangTable.findMany({
    where: and(eq(barangTable.tipe, 1), eq(barangTable.status, 2))
  });

  const barangJadi = await db.query.barangTable.findMany({
    where: and(eq(barangTable.tipe, 2), eq(barangTable.status, 2))
  });

  const data = await db.query.prosesTable.findFirst({
    where: eq(prosesTable.id, id),
    with: {
      produkProses: true
    }
  });

  const trx = await getNumber('PRO', prosesTable, prosesTable.noProses);

  return {
    form: await superValidate(data, zod(formSchema)),
    itemBahanMentah: data?.produkProses
      .filter((i) => i.tipeBarang === 1)
      .map(({ id, barangId, kuantitas, tipeBarang }) => ({ id, barangId, kuantitas, tipeBarang })),
    itemBarangJadi: data?.produkProses
      .filter((i) => i.tipeBarang === 2)
      .map(({ id, barangId, kuantitas, tipeBarang }) => ({ id, barangId, kuantitas, tipeBarang })),
    bahanMentah,
    barangJadi,
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

    for (const [i, v] of form.data.bahanMentah.entries()) {
      const barang = await db.query.barangTable.findFirst({
        where: eq(barangTable.id, v.barangId)
      });
      const oldProduct = await db.query.prosesProdukTable.findFirst({
        where: eq(prosesProdukTable.id, v.id)
      });

      if (oldProduct) {
        if (oldProduct.barangId === v.barangId) {
          const diff = v.kuantitas - oldProduct.kuantitas;
          if (diff > barang!.stok) {
            return setError(
              form,
              `bahanMentah[${i}].kuantitas`,
              `Stok hanya tersisa ${barang!.stok + oldProduct.kuantitas}`
            );
          }
        }
      }

      if (v.kuantitas > barang!.stok) {
        return setError(form, `bahanMentah[${i}].kuantitas`, `Stok hanya tersisa ${barang!.stok}`);
      }
    }

    const produkProses = [...form.data.bahanMentah, ...form.data.barangJadi];

    if (!form.data.id) {
      // ADD PRODUCTS
      form.data.id = generateIdFromEntropySize(10);
      await db.insert(prosesTable).values({
        id: form.data.id,
        tanggal: form.data.tanggal,
        noProses: form.data.noProses
      });

      produkProses.forEach(async (v) => {
        v.id = generateIdFromEntropySize(10);
        await adjustStok(v.tipeBarang === 1 ? 0 : 1, v.kuantitas, v.barangId);

        await db.insert(prosesProdukTable).values({
          noProses: form.data.noProses,
          tipeBarang: v.tipeBarang,
          id: v.id,
          barangId: v.barangId,
          kuantitas: v.kuantitas
        });
      });
    } else {
      // Update
      await db
        .update(prosesTable)
        .set({
          tanggal: form.data.tanggal,
          noProses: form.data.noProses
        })
        .where(eq(prosesTable.id, form.data.id));

      const originalProducts = await db.query.prosesProdukTable.findMany({
        where: and(eq(prosesProdukTable.noProses, form.data.noProses))
      });

      const deletedProducts = originalProducts.filter(
        (op) => !produkProses.some((up) => up.id === op.id)
      );
      deletedProducts.forEach(async (v) => {
        await adjustStok(v.tipeBarang === 1 ? 1 : 0, v.kuantitas, v.barangId);
        await db.delete(prosesProdukTable).where(eq(prosesProdukTable.id, v.id));
      });

      const updatedProducts = produkProses.filter((up) =>
        originalProducts.some((op) => op.id === up.id)
      );
      updatedProducts.forEach(async (v) => {
        const originalProduct = originalProducts.find((op) => op.id === v.id);

        await adjustStok(
          v.tipeBarang === 1 ? 1 : 0,
          originalProduct!.kuantitas,
          originalProduct!.barangId
        );
        await adjustStok(v.tipeBarang === 1 ? 0 : 1, v.kuantitas, v.barangId);

        await db
          .update(prosesProdukTable)
          .set({
            barangId: v.barangId,
            kuantitas: v.kuantitas,
            tipeBarang: v.tipeBarang
          })
          .where(eq(prosesProdukTable.id, v.id));
      });

      const addedProducts = produkProses.filter(
        (up) => !originalProducts.some((op) => op.id === up.id)
      );
      addedProducts.forEach(async (v) => {
        await adjustStok(v.tipeBarang === 1 ? 0 : 1, v.kuantitas, v.barangId);
        await db.insert(prosesProdukTable).values({
          id: generateIdFromEntropySize(10),
          noProses: form.data.noProses,
          barangId: v.barangId,
          kuantitas: v.kuantitas,
          tipeBarang: v.tipeBarang
        });
      });
    }

    return {
      form
    };
  }
};
