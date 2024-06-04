import { db } from '$lib/server';
import { pengirimanTable } from '$lib/server/schema/inventory';
import { fail } from '@sveltejs/kit';
import { desc, eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { pemesananPenjualanTable } from '$lib/server/schema/penjualan';

export const load: PageServerLoad = async () => {
  const pengirimanBarangData = await db.query.pengirimanTable.findMany({
    columns: {
      id: true,
      tanggal: true,
      noSuratJalan: true
    },
    orderBy: desc(pengirimanTable.createdAt),
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
    pengirimanBarangData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    const pengirimanBarang = await db.query.pengirimanTable.findFirst({
      where: eq(pengirimanTable.id, id)
    });

    const penjualanId = pengirimanBarang?.pemesananPenjualanId;

    if (penjualanId) {
      await db
        .update(pemesananPenjualanTable)
        .set({
          status: sql<number>`${pemesananPenjualanTable.status} - 2`
        })
        .where(eq(pemesananPenjualanTable.id, penjualanId));
    }

    try {
      await db.delete(pengirimanTable).where(eq(pengirimanTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
