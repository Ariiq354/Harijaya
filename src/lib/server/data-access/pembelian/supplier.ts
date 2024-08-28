import { db } from '$lib/server/database';
import { supplierTable, type NewSupplier } from '$lib/server/database/schema/pembelian';
import { desc, eq, sql } from 'drizzle-orm';

export async function getCountSupplier() {
  const supplier = await db
    .select({
      count: sql<number>`coalesce(count(${supplierTable.id}), 0)`
    })
    .from(supplierTable);
  return supplier[0].count;
}

export async function getAllSupplier() {
  const data = await db.query.supplierTable.findMany({
    orderBy: desc(supplierTable.createdAt)
  });
  return data;
}

export async function getSupplierById(id: string) {
  const data = await db.query.supplierTable.findFirst({
    where: eq(supplierTable.id, id)
  });
  return data;
}

export async function createSupplier(data: NewSupplier) {
  await db.insert(supplierTable).values(data);
}

export async function updateSupplierById(data: Partial<NewSupplier>, id: string) {
  await db.update(supplierTable).set(data).where(eq(supplierTable.id, id));
}

export async function deleteSupplierById(id: string) {
  await db.delete(supplierTable).where(eq(supplierTable.id, id));
}
