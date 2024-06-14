import { db } from '$lib/server';
import { fakturPembelianTable } from '$lib/server/schema/pembelian';
import { adjustStok } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const fakturPembelianData = await db.query.fakturPembelianTable.findMany({
    orderBy: desc(fakturPembelianTable.createdAt),
    with: {
      supplier: {
        columns: {
          name: true
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

    try {
      const data = await db.query.fakturPembelianTable.findFirst({
        where: eq(fakturPembelianTable.id, id),
        with: {
          produk: true
        }
      });
      data?.produk.forEach(async (i) => {
        await adjustStok(0, i.kuantitas, i.barangId);
      });
      await db.delete(fakturPembelianTable).where(eq(fakturPembelianTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
