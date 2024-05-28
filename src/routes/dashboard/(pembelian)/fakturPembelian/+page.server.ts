import { db } from '$lib/server';
import { fakturPemesananTable, pemesananPembelianTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const pemesananPembelianData = await db.query.fakturPemesananTable.findMany({
    columns: {
      id: true,
      noFaktur: true,
      tanggal: true,
      total: true
    },
    orderBy: desc(fakturPemesananTable.createdAt),
    with: {
      pemesananPembelian: {
        columns: {
          noPemesanan: true
        },
        with: {
          supplier: {
            columns: {
              name: true
            }
          }
        }
      }
    }
  });

  return {
    pemesananPembelianData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      await db.delete(pemesananPembelianTable).where(eq(pemesananPembelianTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
