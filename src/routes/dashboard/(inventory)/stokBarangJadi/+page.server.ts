import { db } from '$lib/server';
import { stokBarangJadiTable } from '$lib/server/schema/inventory';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const data = await db.query.stokBarangJadiTable.findMany({
    orderBy: [desc(stokBarangJadiTable.createdAt)],
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
