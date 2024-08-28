import { db } from '$lib/server/database';
import { prosesProdukTable, prosesTable } from '$lib/server/database/schema/inventory';
import { barangHargaTable, barangTable } from '$lib/server/database/schema/penjualan';
import { fail } from '@sveltejs/kit';
import { and, eq, gt, sql } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { getNumber } from '$lib/server/common';
import { updateJurnalUseCase } from '$lib/server/use-cases/jurnal';
import { updateStokUseCase } from '$lib/server/use-cases/stok';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const bahanMentah = await db.query.barangTable.findMany({
    where: and(eq(barangTable.tipe, 1), eq(barangTable.status, 2)),
    with: {
      barangHarga: true
    }
  });

  const barangJadi = await db.query.barangTable.findMany({
    where: and(eq(barangTable.tipe, 2), eq(barangTable.status, 2)),
    with: {
      barangHarga: true
    }
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
      .map(({ id, barangId, kuantitas, tipeBarang, harga }) => ({
        id,
        barangId,
        kuantitas,
        tipeBarang,
        harga
      })),
    itemBarangJadi: data?.produkProses
      .filter((i) => i.tipeBarang === 2)
      .map(({ id, barangId, kuantitas, tipeBarang, harga }) => ({
        id,
        barangId,
        kuantitas,
        tipeBarang,
        harga
      })),
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
      const barang = await db.query.barangHargaTable.findFirst({
        where: and(eq(barangHargaTable.barangId, v.barangId), eq(barangHargaTable.harga, v.harga))
      });
      const oldProduct = await db.query.prosesProdukTable.findFirst({
        where: eq(prosesProdukTable.id, v.id)
      });

      if (oldProduct) {
        if (oldProduct.barangId === v.barangId && oldProduct.harga === v.harga) {
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

    const totalMentah = form.data.bahanMentah.reduce((a, i) => a + i.kuantitas, 0);
    const totalJadi = form.data.barangJadi.reduce((a, i) => a + i.kuantitas, 0);

    await updateJurnalUseCase(form.data.noProses, '1-30001', -totalMentah);
    await updateJurnalUseCase(form.data.noProses, '1-30002', totalJadi);

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
        await updateStokUseCase(
          v.barangId,
          v.tipeBarang === 1 ? -v.kuantitas : v.kuantitas,
          v.harga
        );

        await db.insert(prosesProdukTable).values({
          harga: v.harga,
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
        await updateStokUseCase(
          v.barangId,
          v.tipeBarang === 1 ? v.kuantitas : -v.kuantitas,
          v.harga
        );
        await db.delete(prosesProdukTable).where(eq(prosesProdukTable.id, v.id));
      });

      const updatedProducts = produkProses.filter((up) =>
        originalProducts.some((op) => op.id === up.id)
      );
      updatedProducts.forEach(async (v) => {
        const originalProduct = originalProducts.find((op) => op.id === v.id);

        await updateStokUseCase(
          originalProduct!.barangId,
          v.tipeBarang === 1 ? originalProduct!.kuantitas : -originalProduct!.kuantitas,
          originalProduct!.harga
        );
        await updateStokUseCase(
          v.barangId,
          v.tipeBarang === 1 ? -v.kuantitas : v.kuantitas,
          v.harga
        );

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
        await updateStokUseCase(
          v.barangId,
          v.tipeBarang === 1 ? -v.kuantitas : v.kuantitas,
          v.harga
        );
        await db.insert(prosesProdukTable).values({
          id: generateIdFromEntropySize(10),
          harga: v.harga,
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
