import { db } from '$lib/server/database';
import { prosesProdukTable, type NewProsesProduk } from '$lib/server/database/schema/inventory';
import { eq } from 'drizzle-orm';

export async function getProsesProdukById(id: string) {
  const data = await db.query.prosesProdukTable.findFirst({
    where: (prosesProduk, { eq }) => eq(prosesProduk.id, id)
  });
  return data;
}

export async function createProsesProduk(data: NewProsesProduk) {
  await db.insert(prosesProdukTable).values(data);
}

export async function updateProsesProdukById(data: Partial<NewProsesProduk>, id: string) {
  await db.update(prosesProdukTable).set(data).where(eq(prosesProdukTable.id, id));
}

export async function deleteProsesProdukById(id: string) {
  await db.delete(prosesProdukTable).where(eq(prosesProdukTable.id, id));
}
