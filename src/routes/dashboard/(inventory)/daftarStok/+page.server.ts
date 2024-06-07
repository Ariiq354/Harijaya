import { db } from '$lib/server';
import { stokTable } from '$lib/server/schema/inventory';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const stokData = await db.query.stokTable.findMany({
    with: {
      barang: {
        columns: {
          name: true,
          deskripsi: true
        }
      }
    },
    orderBy: [desc(stokTable.createdAt)]
  });

  return {
    stokData
  };
};
