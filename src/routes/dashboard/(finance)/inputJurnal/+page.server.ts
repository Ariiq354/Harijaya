import { db } from '$lib/server';
import { jurnalTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const jurnalData = await db.query.jurnalTable.findMany({
    with: {
      akunDebit: true,
      akunKredit: true
    }
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
