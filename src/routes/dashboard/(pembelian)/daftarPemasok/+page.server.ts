import { db } from '$lib/server';
import { supplierTable } from '$lib/server/schema/pembelian';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const pemasokData = await db.query.supplierTable.findMany({
    orderBy: [desc(supplierTable.createdAt)]
  });

  return {
    pemasokData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      await db.delete(supplierTable).where(eq(supplierTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
