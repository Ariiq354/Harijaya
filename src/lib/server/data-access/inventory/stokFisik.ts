import { db } from '$lib/server/database';
import { stokFisikTable, type NewStokFisik } from '$lib/server/database/schema/inventory';
import { eq } from 'drizzle-orm';

export async function getStokFisikById(id: string) {
  const data = await db.query.stokFisikTable.findFirst({
    where: (stokFisik, { eq }) => eq(stokFisik.id, id)
  });
  return data;
}

export async function createStokFisik(data: NewStokFisik) {
  await db.insert(stokFisikTable).values(data);
}

export async function updateStokFisikById(data: Partial<NewStokFisik>, id: string) {
  await db.update(stokFisikTable).set(data).where(eq(stokFisikTable.id, id));
}

export async function deleteStokFisikById(id: string) {
  await db.delete(stokFisikTable).where(eq(stokFisikTable.id, id));
}
