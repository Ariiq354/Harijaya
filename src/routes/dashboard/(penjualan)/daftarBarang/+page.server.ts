import { db } from '$lib/server/database';
import { barangTable } from '$lib/server/database/schema/penjualan';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const barangData = await db.query.barangTable.findMany({
    orderBy: [desc(barangTable.createdAt)]
  });

  return {
    barangData
  };
};
