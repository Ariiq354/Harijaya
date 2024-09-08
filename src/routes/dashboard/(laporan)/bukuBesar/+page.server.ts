import { db } from '$lib/server/database';
import { jurnalTable } from '$lib/server/database/schema/keuangan';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { getAllAkun } from '$lib/server/use-cases/laporan/bukuBesar';

export const load: PageServerLoad = async () => {
  const akun = await getAllAkun();
  const jurnalData = await db.query.jurnalTable.findMany({
    with: {
      akun: true
    },
    orderBy: [desc(jurnalTable.createdAt)]
  });

  return {
    jurnalData,
    akun
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
