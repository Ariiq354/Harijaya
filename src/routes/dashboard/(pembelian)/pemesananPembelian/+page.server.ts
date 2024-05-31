import { db } from '$lib/server';
import { pemesananPembelianTable } from '$lib/server/schema/pembelian';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const pemesananPembelianData = await db.query.pemesananPembelianTable.findMany({
    orderBy: desc(pemesananPembelianTable.createdAt),
    with: {
      supplier: {
        columns: {
          name: true
        }
      }
    }
  });

  return {
    pemesananPembelianData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      await db.delete(pemesananPembelianTable).where(eq(pemesananPembelianTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
