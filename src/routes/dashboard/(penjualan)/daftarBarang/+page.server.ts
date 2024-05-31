import { db } from '$lib/server';
import { barangTable } from '$lib/server/schema/penjualan';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const barangData = await db.query.barangTable.findMany({
    orderBy: [desc(barangTable.createdAt)]
  });

  return {
    barangData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      await db.delete(barangTable).where(eq(barangTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
