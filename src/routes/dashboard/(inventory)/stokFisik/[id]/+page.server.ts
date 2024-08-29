import { db } from '$lib/server/database';
import { stokFisikProdukTable, stokFisikTable } from '$lib/server/database/schema/inventory';
import { barangHargaTable, barangTable } from '$lib/server/database/schema/penjualan';
import { fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { updateStokUseCase } from '$lib/server/use-cases/stok';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const barang = await db.query.barangTable.findMany({
    where: eq(barangTable.status, 2)
  });
  const barangHarga = await db.query.barangHargaTable.findMany();
  const data = await db.query.stokFisikTable.findFirst({
    where: eq(stokFisikTable.id, id),
    with: {
      produkStok: true
    }
  });

  return {
    form: await superValidate(data, zod(formSchema)),
    barang,
    barangHarga
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

    for (const [i, v] of form.data.produkStok.entries()) {
      if (v.tipe === 1) {
        const barang = await db.query.barangHargaTable.findFirst({
          where: and(eq(barangHargaTable.barangId, v.barangId), eq(barangHargaTable.harga, v.harga))
        });
        const oldProduct = await db.query.stokFisikProdukTable.findFirst({
          where: eq(stokFisikProdukTable.id, v.id)
        });

        if (oldProduct) {
          if (oldProduct.tipe === 1) {
            if (oldProduct.barangId === v.barangId) {
              const diff = v.kuantitas - oldProduct.kuantitas;
              if (diff > barang!.stok) {
                return setError(form, `produkStok[${i}].kuantitas`, 'Stok tidak mencukupi');
              }
            }
          } else {
            const stokAsli = barang!.stok - oldProduct.kuantitas;
            if (v.kuantitas > stokAsli) {
              return setError(form, `produkStok[${i}].kuantitas`, 'Stok tidak mencukupi');
            }
          }
        }

        if (v.kuantitas > barang!.stok) {
          return setError(form, `produkStok[${i}].kuantitas`, 'Stok tidak mencukupi');
        }
      }
    }

    for (const [index, item] of form.data.entries()){
      if(item.tipe === 1) {
        await updateJurnalUseCase(item., '1-30001', -totalMentah);
        await updateJurnalUseCase(form.data.noProses, '1-30002', totalJadi);
      }
    }


    if (!form.data.id) {
      //Add products
      form.data.id = generateIdFromEntropySize(10);
      await db.insert(stokFisikTable).values({
        id: form.data.id,
        noStokFisik: form.data.noStokFisik,
        tanggal: form.data.tanggal
      });

      form.data.produkStok.forEach(async (v) => {
        v.id = generateIdFromEntropySize(10);
        await updateStokUseCase(v.barangId, v.kuantitas, v.harga);
        await db.insert(stokFisikProdukTable).values({
          id: v.id,
          noStokFisik: form.data.noStokFisik,
          barangId: v.barangId,
          harga: v.harga,
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
        where: eq(stokFisikProdukTable.noStokFisik, form.data.noStokFisik)
      });

      const deletedProducts = originalProducts.filter(
        (op) => !form.data.produkStok.some((up) => up.id === op.id)
      );
      deletedProducts.forEach(async (v) => {
        await updateStokUseCase(v.barangId, v.tipe === 1 ? v.kuantitas : -v.kuantitas, v.harga);
        await db.delete(stokFisikProdukTable).where(eq(stokFisikProdukTable.id, v.id));
      });

      const updatedProducts = form.data.produkStok.filter((up) =>
        originalProducts.some((op) => op.id === up.id)
      );
      updatedProducts.forEach(async (v) => {
        const originalProduct = originalProducts.find((op) => op.id === v.id);

        await updateStokUseCase(
          originalProduct!.barangId,
          v.tipe === 1 ? v.kuantitas : -v.kuantitas,
          originalProduct!.harga
        );
        await updateStokUseCase(v.barangId, v.tipe === 1 ? -v.kuantitas : v.kuantitas, v.harga);

        await db
          .update(stokFisikProdukTable)
          .set({
            barangId: v.barangId,
            kuantitas: v.kuantitas,
            tipe: v.tipe
          })
          .where(eq(stokFisikProdukTable.id, v.id));
      });

      const addedProducts = form.data.produkStok.filter(
        (up) => !originalProducts.some((op) => op.id === up.id)
      );
      addedProducts.forEach(async (v) => {
        await updateStokUseCase(v.barangId, v.tipe === 1 ? -v.kuantitas : v.kuantitas, v.harga);
        await db.insert(stokFisikProdukTable).values({
          id: generateIdFromEntropySize(10),
          tipe: v.tipe,
          noStokFisik: form.data.noStokFisik,
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
