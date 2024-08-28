import { db } from '$lib/server/database';
import { stokFisikTable } from '$lib/server/database/schema/inventory';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { jurnalTable } from '$lib/server/database/schema/keuangan';
import { updateStokUseCase } from '$lib/server/use-cases/stok';

export const load: PageServerLoad = async () => {
  const stokFisikData = await db.query.stokFisikTable.findMany({
    orderBy: desc(stokFisikTable.createdAt)
  });

  return {
    stokFisikData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      const data = await db.query.stokFisikTable.findFirst({
        where: eq(stokFisikTable.id, id),
        with: {
          produkStok: true
        }
      });
      data?.produkStok.forEach(async (i) => {
        await updateStokUseCase(i.barangId, i.tipe === 1 ? i.kuantitas : -i.kuantitas, i.harga);
      });
      await db.delete(stokFisikTable).where(eq(stokFisikTable.id, id));
      await db.delete(jurnalTable).where(eq(jurnalTable.kodeTransaksi, data!.noStokFisik));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }
  }
};
