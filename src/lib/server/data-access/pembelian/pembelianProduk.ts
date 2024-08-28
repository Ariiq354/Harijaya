import { db } from '$lib/server/database';
import {
  pembelianProdukTable,
  type NewPembelianProduk
} from '$lib/server/database/schema/pembelian';
import { eq } from 'drizzle-orm';

export async function getPembelianProdukById(id: string) {
  const data = await db.query.pembelianProdukTable.findFirst({
    where: (pembelianProduk, { eq }) => eq(pembelianProduk.id, id)
  });
  return data;
}

export async function createPembelianProduk(data: NewPembelianProduk) {
  await db.insert(pembelianProdukTable).values(data);
}

export async function updatePembelianProdukById(data: Partial<NewPembelianProduk>, id: string) {
  await db.update(pembelianProdukTable).set(data).where(eq(pembelianProdukTable.id, id));
}

export async function deletePembelianProdukById(id: string) {
  await db.delete(pembelianProdukTable).where(eq(pembelianProdukTable.id, id));
}
