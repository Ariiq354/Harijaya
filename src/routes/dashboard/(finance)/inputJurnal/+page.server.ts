import { db } from '$lib/server';
import { jurnalTable } from '$lib/server/schema/keuangan';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const jurnalData = await db.query.jurnalTable.findMany({
    with: {
      akunDebit: true,
      akunKredit: true
    },
    orderBy: [desc(jurnalTable.createdAt)]
  });

  return {
    jurnalData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      await db.delete(jurnalTable).where(eq(jurnalTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
