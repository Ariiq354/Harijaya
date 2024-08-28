import { db } from '$lib/server/database';
import { prosesTable } from '$lib/server/database/schema/inventory';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { jurnalTable } from '$lib/server/database/schema/keuangan';
import { updateStokUseCase } from '$lib/server/use-cases/stok';

export const load: PageServerLoad = async () => {
  const prosesData = await db.query.prosesTable.findMany({
    orderBy: desc(prosesTable.createdAt),
    with: {
      produkProses: {
        columns: {
          kuantitas: true,
          tipeBarang: true
        }
      }
    }
  });

  return {
    prosesData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      let totalMentah = 0;
      let totalJadi = 0;

      const data = await db.query.prosesTable.findFirst({
        where: eq(prosesTable.id, id),
        with: {
          produkProses: true
        }
      });

      data?.produkProses.forEach(async (i) => {
        await updateStokUseCase(
          i.barangId,
          i.tipeBarang === 1 ? i.kuantitas : -i.kuantitas,
          i.harga
        );
        if (i.tipeBarang === 1) {
          totalMentah += i.kuantitas;
        } else {
          totalJadi += i.kuantitas;
        }
      });

      await db.delete(prosesTable).where(eq(prosesTable.id, id));
      await db.delete(jurnalTable).where(eq(jurnalTable.kodeTransaksi, data!.noProses));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
