import { db } from '$lib/server/database';
import {
  penjualanProdukTable,
  type NewPenjualanProduk
} from '$lib/server/database/schema/penjualan';
import { eq } from 'drizzle-orm';

export async function getPenjualanProdukById(id: string) {
  const data = await db.query.penjualanProdukTable.findFirst({
    where: (penjualanProduk, { eq }) => eq(penjualanProduk.id, id)
  });
  return data;
}

export async function createPenjualanProduk(data: NewPenjualanProduk) {
  await db.insert(penjualanProdukTable).values(data);
}

export async function updatePenjualanProdukById(data: Partial<NewPenjualanProduk>, id: string) {
  await db.update(penjualanProdukTable).set(data).where(eq(penjualanProdukTable.id, id));
}

export async function deletePenjualanProdukById(id: string) {
  await db.delete(penjualanProdukTable).where(eq(penjualanProdukTable.id, id));
}
