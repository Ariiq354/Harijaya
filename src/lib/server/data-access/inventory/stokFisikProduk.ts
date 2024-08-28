import { db } from '$lib/server/database';
import {
  stokFisikProdukTable,
  type NewStokFisikProduk
} from '$lib/server/database/schema/inventory';
import { eq } from 'drizzle-orm';

export async function getStokFisikProdukById(id: string) {
  const data = await db.query.stokFisikProdukTable.findFirst({
    where: (stokFisikProduk, { eq }) => eq(stokFisikProduk.id, id)
  });
  return data;
}

export async function createStokFisikProduk(data: NewStokFisikProduk) {
  await db.insert(stokFisikProdukTable).values(data);
}

export async function updateStokFisikProdukById(data: Partial<NewStokFisikProduk>, id: string) {
  await db.update(stokFisikProdukTable).set(data).where(eq(stokFisikProdukTable.id, id));
}

export async function deleteStokFisikProdukById(id: string) {
  await db.delete(stokFisikProdukTable).where(eq(stokFisikProdukTable.id, id));
}
