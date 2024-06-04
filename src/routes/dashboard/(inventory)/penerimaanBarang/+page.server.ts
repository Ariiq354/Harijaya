import { db } from '$lib/server';
import { penerimaanTable } from '$lib/server/schema/inventory';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const penerimaanBarangData = await db.query.penerimaanTable.findMany({
    columns: {
      id: true,
      tanggal: true,
      noSuratJalan: true
    },
    orderBy: desc(penerimaanTable.createdAt),
    with: {
      pemesananPembelian: {
        columns: {
          noPembelian: true
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
    penerimaanBarangData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      await db.delete(penerimaanTable).where(eq(penerimaanTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
