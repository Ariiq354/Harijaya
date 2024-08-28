import { db } from '$lib/server/database';
import {
  pembayaranPiutangTable,
  type NewPembayaranPiutang
} from '$lib/server/database/schema/keuangan';
import { eq } from 'drizzle-orm';

export async function getPembayaranPiutangById(id: string) {
  const data = await db.query.pembayaranPiutangTable.findFirst({
    where: (pembayaranPiutang, { eq }) => eq(pembayaranPiutang.id, id)
  });
  return data;
}

export async function createPembayaranPiutang(data: NewPembayaranPiutang) {
  await db.insert(pembayaranPiutangTable).values(data);
}

export async function updatePembayaranPiutangById(data: Partial<NewPembayaranPiutang>, id: string) {
  await db.update(pembayaranPiutangTable).set(data).where(eq(pembayaranPiutangTable.id, id));
}

export async function deletePembayaranPiutangById(id: string) {
  await db.delete(pembayaranPiutangTable).where(eq(pembayaranPiutangTable.id, id));
}
