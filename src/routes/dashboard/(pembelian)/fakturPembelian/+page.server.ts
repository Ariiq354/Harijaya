import { db } from '$lib/server';
import {
  fakturPembelianTable,
  pemesananPembelianRelations,
  pemesananPembelianTable
} from '$lib/server/schema/pembelian';
import { fail } from '@sveltejs/kit';
import { desc, eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const fakturPembelianData = await db.query.fakturPembelianTable.findMany({
    columns: {
      id: true,
      noFaktur: true,
      tanggal: true,
      total: true
    },
    orderBy: desc(fakturPembelianTable.createdAt),
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
    fakturPembelianData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    const fakturPembelian = await db.query.fakturPembelianTable.findFirst({
      where: eq(fakturPembelianTable.id, id)
    });

    const pembelianId = fakturPembelian?.pembelianId;

    if (pembelianId) {
      await db
        .update(pemesananPembelianTable)
        .set({
          status: sql<number>`${pemesananPembelianTable.status} - 1`
        })
        .where(eq(pemesananPembelianTable.id, pembelianId));
    }

    try {
      await db.delete(fakturPembelianTable).where(eq(fakturPembelianTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
