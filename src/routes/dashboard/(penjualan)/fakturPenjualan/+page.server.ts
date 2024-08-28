import { db } from '$lib/server/database';
import { fakturPenjualanTable } from '$lib/server/database/schema/penjualan';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { piutangTable } from '$lib/server/database/schema/keuangan';
import { updateStokUseCase } from '$lib/server/use-cases/stok';

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
        await updateStokUseCase(i.barangId, i.kuantitas, i.harga);
      });
      await db.delete(fakturPenjualanTable).where(eq(fakturPenjualanTable.id, id));
      await db.delete(piutangTable).where(eq(piutangTable.noFaktur, data!.id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }
  }
};
