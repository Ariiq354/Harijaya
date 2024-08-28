import { db } from '$lib/server/database';
import { barangHargaTable, type NewBarangHarga } from '$lib/server/database/schema/penjualan';
import { and, eq, sql } from 'drizzle-orm';

export async function getBarangHargaById(id: string) {
  const data = await db.query.barangHargaTable.findFirst({
    where: (barangHarga, { eq }) => eq(barangHarga.id, id)
  });
  return data;
}

export async function getStok(barangId: string, harga: number) {
  const data = await db.query.barangHargaTable.findFirst({
    where: and(eq(barangHargaTable.barangId, barangId), eq(barangHargaTable.harga, harga)),
    columns: {
      stok: true
    }
  });
  return data;
}

export async function createBarangHarga(data: NewBarangHarga) {
  await db.insert(barangHargaTable).values(data);
}

export async function createBarangHargaStok(
  kuantitas: number,
  id: string,
  harga: number,
  barangId: string
) {
  await db.insert(barangHargaTable).values({
    id,
    barangId,
    harga,
    stok: kuantitas
  });
}

export async function updateBarangHargaById(data: Partial<NewBarangHarga>, id: string) {
  await db.update(barangHargaTable).set(data).where(eq(barangHargaTable.id, id));
}

export async function updateBarangHargaStok(id: string, kuantitas: number) {
  await db
    .update(barangHargaTable)
    .set({
      stok: sql<number>`${barangHargaTable.stok} + ${kuantitas}`
    })
    .where(eq(barangHargaTable.id, id));
}

export async function deleteBarangHargaById(id: string) {
  await db.delete(barangHargaTable).where(eq(barangHargaTable.id, id));
}
