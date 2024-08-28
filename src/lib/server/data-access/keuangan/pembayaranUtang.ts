import { db } from '$lib/server/database';
import {
  pembayaranUtangTable,
  type NewPembayaranUtang
} from '$lib/server/database/schema/keuangan';
import { eq } from 'drizzle-orm';

export async function getPembayaranUtangById(id: string) {
  const data = await db.query.pembayaranUtangTable.findFirst({
    where: (pembayaranUtang, { eq }) => eq(pembayaranUtang.id, id)
  });
  return data;
}

export async function createPembayaranUtang(data: NewPembayaranUtang) {
  await db.insert(pembayaranUtangTable).values(data);
}

export async function updatePembayaranUtangById(data: Partial<NewPembayaranUtang>, id: string) {
  await db.update(pembayaranUtangTable).set(data).where(eq(pembayaranUtangTable.id, id));
}

export async function deletePembayaranUtangById(id: string) {
  await db.delete(pembayaranUtangTable).where(eq(pembayaranUtangTable.id, id));
}
