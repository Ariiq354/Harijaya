import { db } from '$lib/server';
import { stokBahanMentahTable } from '$lib/server/schema/inventory';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const data = await db.query.stokBahanMentahTable.findMany({
    orderBy: [desc(stokBahanMentahTable.createdAt)],
    with: {
      barang: {
        columns: {
          name: true
        }
      }
    }
  });

  return {
    data
  };
};
