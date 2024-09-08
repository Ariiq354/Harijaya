import { db } from '$lib/server/database';
import { akunTable, type NewAkun } from '$lib/server/database/schema/keuangan';
import { eq } from 'drizzle-orm';

export async function getAkunById(id: string) {
  const data = await db.query.akunTable.findFirst({
    where: (akun, { eq }) => eq(akun.id, id)
  });
  return data;
}

export async function getAllAkun() {
  const data = await db.query.akunTable.findMany();

  return data;
}

export async function createAkun(data: NewAkun) {
  await db.insert(akunTable).values(data);
}

export async function updateAkunById(data: Partial<NewAkun>, id: string) {
  await db.update(akunTable).set(data).where(eq(akunTable.id, id));
}

export async function deleteAkunById(id: string) {
  await db.delete(akunTable).where(eq(akunTable.id, id));
}
