import { db } from '$lib/server';
import { prosesTable } from '$lib/server/schema/inventory';
import { adjustStok } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

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
      const data = await db.query.prosesTable.findFirst({
        where: eq(prosesTable.id, id),
        with: {
          produkProses: true
        }
      });
      data?.produkProses.forEach(async (i) => {
        await adjustStok(i.tipeBarang, i.kuantitas, i.barangId);
      });
      await db.delete(prosesTable).where(eq(prosesTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
