import { db } from '$lib/server';
import { fakturPenjualanTable } from '$lib/server/schema/penjualan';
import { fail } from '@sveltejs/kit';
import { desc, eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { stokBarangJadiTable } from '$lib/server/schema/inventory';

export const load: PageServerLoad = async () => {
  const fakturPenjualanData = await db.query.fakturPenjualanTable.findMany({
    orderBy: desc(fakturPenjualanTable.createdAt),
    with: {
      pelanggan: {
        columns: {
          name: true
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
      const data = await db.query.fakturPenjualanTable.findFirst({
        where: eq(fakturPenjualanTable.id, id),
        with: {
          produk: true
        }
      });
      data?.produk.forEach(async (i) => {
        await db
          .update(stokBarangJadiTable)
          .set({
            stok: sql<number>`${stokBarangJadiTable.stok} - (${i.kuantitas})`
          })
          .where(eq(stokBarangJadiTable.barangId, i.barangId!));
      });
      await db.delete(fakturPenjualanTable).where(eq(fakturPenjualanTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }
  }
};
