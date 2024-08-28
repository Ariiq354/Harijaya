import { db } from '$lib/server/database';
import {
  fakturPenjualanTable,
  type NewFakturPenjualan
} from '$lib/server/database/schema/penjualan';
import { eq, sql } from 'drizzle-orm';

export async function getCountFakturPenjualan() {
  const fakturPenjualan = await db
    .select({
      count: sql<number>`coalesce(count(${fakturPenjualanTable.id}), 0)`
    })
    .from(fakturPenjualanTable);
  return fakturPenjualan[0].count;
}

export async function getFakturPenjualanById(id: string) {
  const data = await db.query.fakturPenjualanTable.findFirst({
    where: (fakturPenjualan, { eq }) => eq(fakturPenjualan.id, id)
  });
  return data;
}

export async function createFakturPenjualan(data: NewFakturPenjualan) {
  await db.insert(fakturPenjualanTable).values(data);
}

export async function updateFakturPenjualanById(data: Partial<NewFakturPenjualan>, id: string) {
  await db.update(fakturPenjualanTable).set(data).where(eq(fakturPenjualanTable.id, id));
}

export async function deleteFakturPenjualanById(id: string) {
  await db.delete(fakturPenjualanTable).where(eq(fakturPenjualanTable.id, id));
}
