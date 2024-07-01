import { db } from '$lib/server';
import { adjustStok } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';
import { desc, eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import {
  pembayaranUtangItemTable,
  pembayaranUtangTable,
  utangTable
} from '$lib/server/schema/keuangan';

export const load: PageServerLoad = async () => {
  const pembayaranUtangData = await db.query.pembayaranUtangTable.findMany({
    orderBy: desc(pembayaranUtangTable.createdAt)
  });

  return {
    pembayaranUtangData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      const data = await db.query.pembayaranUtangItemTable.findMany({
        where: eq(pembayaranUtangItemTable.noPembayaran, id)
      });

      data.forEach(async (i) => {
        await db
          .update(utangTable)
          .set({
            sisa: sql<number>`${utangTable.sisa} + ${i.nilai}`
          })
          .where(eq(utangTable.id, i.noUtang!));
      });

      await db.delete(pembayaranUtangTable).where(eq(pembayaranUtangTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
