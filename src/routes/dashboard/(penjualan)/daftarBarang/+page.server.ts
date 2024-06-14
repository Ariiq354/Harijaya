import { db } from '$lib/server';
import { barangTable } from '$lib/server/schema/penjualan';
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
