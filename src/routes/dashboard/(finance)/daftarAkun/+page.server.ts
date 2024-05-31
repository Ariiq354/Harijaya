import { db } from '$lib/server';
import { akunTable } from '$lib/server/schema/keuangan';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const akunData = await db.query.akunTable.findMany({
    orderBy: [desc(akunTable.createdAt)]
  });

  return {
    akunData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      await db.delete(akunTable).where(eq(akunTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
