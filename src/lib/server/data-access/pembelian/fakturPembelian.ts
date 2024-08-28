import { db } from '$lib/server/database';
import {
  fakturPembelianTable,
  type NewFakturPembelian
} from '$lib/server/database/schema/pembelian';
import { desc, eq, sql } from 'drizzle-orm';

export async function getCountFakturPembelian() {
  const fakturPembelian = await db
    .select({
      count: sql<number>`coalesce(count(${fakturPembelianTable.id}), 0)`
    })
    .from(fakturPembelianTable);
  return fakturPembelian[0].count;
}

export async function getAllFakturPembelian() {
  const data = await db.query.fakturPembelianTable.findMany({
    orderBy: desc(fakturPembelianTable.createdAt),
    with: {
      supplier: true,
      pembayaran: true
    }
  });
  return data;
}

export async function getFakturPembelianById(id: string) {
  const data = await db.query.fakturPembelianTable.findFirst({
    where: (fakturPembelian, { eq }) => eq(fakturPembelian.id, id),
    with: {
      produk: true
    }
  });
  return data;
}

export async function getFakturPembelianByNoFaktur(noFaktur: string) {
  const data = await db.query.fakturPembelianTable.findFirst({
    where: (fakturPembelian, { eq }) => eq(fakturPembelian.noFaktur, noFaktur)
  });
  return data;
}

export async function getFakturPembelianByIdWithBarang(id: string) {
  const data = await db.query.fakturPembelianTable.findFirst({
    where: (fakturPembelian, { eq }) => eq(fakturPembelian.id, id),
    with: {
      produk: {
        with: {
          barang: true
        }
      },
      supplier: true
    }
  });
  return data;
}

export async function createFakturPembelian(data: NewFakturPembelian) {
  await db.insert(fakturPembelianTable).values(data);
}

export async function updateFakturPembelianById(data: Partial<NewFakturPembelian>, id: string) {
  await db.update(fakturPembelianTable).set(data).where(eq(fakturPembelianTable.id, id));
}

export async function deleteFakturPembelianById(id: string) {
  await db.delete(fakturPembelianTable).where(eq(fakturPembelianTable.id, id));
}
