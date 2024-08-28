import { db } from '$lib/server/database';
import { jurnalTable, type NewJurnal } from '$lib/server/database/schema/keuangan';
import { eq } from 'drizzle-orm';

export async function getJurnalById(id: string) {
  const data = await db.query.jurnalTable.findFirst({
    where: (jurnal, { eq }) => eq(jurnal.id, id)
  });
  return data;
}

export async function getJurnalByKode(kode: string) {
  const data = await db.query.jurnalTable.findFirst({
    where: (jurnal, { eq }) => eq(jurnal.kodeTransaksi, kode)
  });
  return data;
}

export async function createJurnal(data: NewJurnal) {
  await db.insert(jurnalTable).values(data);
}

export async function updateJurnalById(data: Partial<NewJurnal>, id: string) {
  await db.update(jurnalTable).set(data).where(eq(jurnalTable.id, id));
}

export async function deleteJurnalById(id: string) {
  await db.delete(jurnalTable).where(eq(jurnalTable.id, id));
}

export async function deleteJurnalByKode(kode: string) {
  await db.delete(jurnalTable).where(eq(jurnalTable.kodeTransaksi, kode));
}
