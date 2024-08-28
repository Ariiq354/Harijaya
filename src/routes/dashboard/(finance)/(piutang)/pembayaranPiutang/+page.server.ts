import { db } from '$lib/server/database';
import {
  pembayaranPiutangItemTable,
  pembayaranPiutangTable,
  piutangTable
} from '$lib/server/database/schema/keuangan';
import { fail } from '@sveltejs/kit';
import { desc, eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const pembayaranPiutangData = await db.query.pembayaranPiutangTable.findMany({
    orderBy: desc(pembayaranPiutangTable.createdAt)
  });

  return {
    pembayaranPiutangData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      const data = await db.query.pembayaranPiutangItemTable.findMany({
        where: eq(pembayaranPiutangItemTable.noPembayaran, id)
      });

      data.forEach(async (i) => {
        await db
          .update(piutangTable)
          .set({
            sisa: sql<number>`${piutangTable.sisa} + ${i.nilai}`
          })
          .where(eq(piutangTable.noFaktur, i.noFaktur!));
      });

      await db.delete(pembayaranPiutangTable).where(eq(pembayaranPiutangTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
