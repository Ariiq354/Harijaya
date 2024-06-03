import { db } from '$lib/server';
import { fakturPenjualanTable } from '$lib/server/schema/penjualan';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const fakturPenjualanData = await db.query.fakturPenjualanTable.findMany({
    columns: {
      id: true,
      noFaktur: true,
      tanggal: true,
      total: true
    },
    orderBy: desc(fakturPenjualanTable.createdAt),
    with: {
      pemesananPenjualan: {
        columns: {
          noPenjualan: true
        },
        with: {
          pelanggan: {
            columns: {
              name: true
            }
          }
        }
      }
    }
  });

  return {
    fakturPenjualanData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      await db.delete(fakturPenjualanTable).where(eq(fakturPenjualanTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
