import { db } from '$lib/server/database';
import { prosesTable, type NewProses } from '$lib/server/database/schema/inventory';
import { eq } from 'drizzle-orm';

export async function getProsesById(id: string) {
  const data = await db.query.prosesTable.findFirst({
    where: (proses, { eq }) => eq(proses.id, id)
  });
  return data;
}

export async function createProses(data: NewProses) {
  await db.insert(prosesTable).values(data);
}

export async function updateProsesById(data: Partial<NewProses>, id: string) {
  await db.update(prosesTable).set(data).where(eq(prosesTable.id, id));
}

export async function deleteProsesById(id: string) {
  await db.delete(prosesTable).where(eq(prosesTable.id, id));
}
