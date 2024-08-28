import { db } from '$lib/server/database';
import { barangTable, type NewBarang } from '$lib/server/database/schema/penjualan';
import { eq, sql, and } from 'drizzle-orm';

export async function getCountBarang() {
  const barang = await db
    .select({
      count: sql<number>`coalesce(count(${barangTable.id}), 0)`
    })
    .from(barangTable);
  return barang[0].count;
}

export async function getBarangById(id: string) {
  const data = await db.query.barangTable.findFirst({
    where: (barang, { eq }) => eq(barang.id, id)
  });
  return data;
}

export async function getBarangByTypeAndStatus(type: number, status: number) {
  const data = await db.query.barangTable.findMany({
    where: and(eq(barangTable.tipe, type), eq(barangTable.status, status))
  });

  return data;
}

export async function createBarang(data: NewBarang) {
  await db.insert(barangTable).values(data);
}

export async function updateBarangById(data: Partial<NewBarang>, id: string) {
  await db.update(barangTable).set(data).where(eq(barangTable.id, id));
}

export async function deleteBarangById(id: string) {
  await db.delete(barangTable).where(eq(barangTable.id, id));
}
