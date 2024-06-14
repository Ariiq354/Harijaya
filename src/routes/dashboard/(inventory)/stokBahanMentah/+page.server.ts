import { db } from '$lib/server';
import { barangTable } from '$lib/server/schema/penjualan';
import { and, desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const data = await db.query.barangTable.findMany({
    where: and(eq(barangTable.tipe, 1), eq(barangTable.status, 2)),
    orderBy: [desc(barangTable.createdAt)]
  });

  return {
    data
  };
};
