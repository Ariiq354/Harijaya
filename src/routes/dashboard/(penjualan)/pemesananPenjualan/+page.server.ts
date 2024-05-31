import { db } from '$lib/server';
import { pemesananPenjualanTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const pemesananPenjualanData = await db.query.pemesananPenjualanTable.findMany({
    orderBy: desc(pemesananPenjualanTable.createdAt),
    with: {
      pelanggan: {
        columns: {
          name: true
        }
      }
    }
  });

  return {
    pemesananPenjualanData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      await db.delete(pemesananPenjualanTable).where(eq(pemesananPenjualanTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
