import { db } from '$lib/server';
import { stokFisikTable } from '$lib/server/schema/inventory';
import { adjustStok } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

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
        await adjustStok(i.tipe === 0 ? 1 : 0, i.kuantitas, i.barangId);
      });
      await db.delete(stokFisikTable).where(eq(stokFisikTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }
  }
};
