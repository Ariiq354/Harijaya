import { db } from '$lib/server/database';
import { utangTable, type NewUtang } from '$lib/server/database/schema/keuangan';
import { eq, sql } from 'drizzle-orm';

export async function getJumlahUtang() {
  const utang = await db
    .select({
      jumlah: sql<number>`coalesce(sum(${utangTable.nilai}), 0)`
    })
    .from(utangTable);
  return utang[0].jumlah;
}

export async function getUtangById(id: string) {
  const data = await db.query.utangTable.findFirst({
    where: (utang, { eq }) => eq(utang.id, id)
  });
  return data;
}

export async function createUtang(data: NewUtang) {
  await db.insert(utangTable).values(data);
}

export async function updateUtangById(data: Partial<NewUtang>, id: string) {
  await db.update(utangTable).set(data).where(eq(utangTable.id, id));
}

export async function deleteUtangById(id: string) {
  await db.delete(utangTable).where(eq(utangTable.id, id));
}

export async function deleteUtangByFaktur(noFaktur: string) {
  await db.delete(utangTable).where(eq(utangTable.noFaktur, noFaktur));
}
