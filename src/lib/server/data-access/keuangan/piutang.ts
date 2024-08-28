import { db } from '$lib/server/database';
import { piutangTable, type NewPiutang } from '$lib/server/database/schema/keuangan';
import { eq, sql } from 'drizzle-orm';

export async function getJumlahPiutang() {
  const piutang = await db
    .select({
      jumlah: sql<number>`coalesce(sum(${piutangTable.nilai}), 0)`
    })
    .from(piutangTable);
  return piutang[0].jumlah;
}

export async function getPiutangById(id: string) {
  const data = await db.query.piutangTable.findFirst({
    where: (piutang, { eq }) => eq(piutang.id, id)
  });
  return data;
}

export async function createPiutang(data: NewPiutang) {
  await db.insert(piutangTable).values(data);
}

export async function updatePiutangById(data: Partial<NewPiutang>, id: string) {
  await db.update(piutangTable).set(data).where(eq(piutangTable.id, id));
}

export async function deletePiutangById(id: string) {
  await db.delete(piutangTable).where(eq(piutangTable.id, id));
}
