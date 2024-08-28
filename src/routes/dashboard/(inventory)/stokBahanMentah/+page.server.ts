import { db } from '$lib/server/database';
import { barangHargaTable, barangTable } from '$lib/server/database/schema/penjualan';
import { and, desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const data = await db
    .select()
    .from(barangHargaTable)
    .leftJoin(barangTable, eq(barangHargaTable.barangId, barangTable.id))
    .where(and(eq(barangTable.tipe, 1), eq(barangTable.status, 2)))
    .orderBy(desc(barangHargaTable.createdAt));

  return {
    data
  };
};
