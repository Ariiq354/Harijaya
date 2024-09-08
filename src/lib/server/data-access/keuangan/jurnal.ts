import { db } from '$lib/server/database';
import { jurnalTable, type NewJurnal } from '$lib/server/database/schema/keuangan';
import { desc, eq, sql } from 'drizzle-orm';

export async function getAllJurnal() {
  const data = await db.query.jurnalTable.findMany({
    with: {
      akun: true
    },
    orderBy: [desc(jurnalTable.createdAt)]
  });
  return data;
}

export async function getJurnalById(id: string) {
  const data = await db.query.jurnalTable.findFirst({
    where: (jurnal, { eq }) => eq(jurnal.id, id)
  });
  return data;
}

export async function getJurnalByPeriod(start: string, end: string, noAkun?: string) {
  const baseQuery = sql`SELECT * FROM ${jurnalTable} WHERE strftime('%Y-%m-%d', ${jurnalTable.createdAt}) BETWEEN ${start} AND ${end}`;

  const query = noAkun ? baseQuery.append(sql` AND ${jurnalTable.noAkun} = ${noAkun}`) : baseQuery;

  await db.run(query);
}

export async function getJurnalByDate(year: string, month?: string | null, noAkun?: string | null) {
  const dateFormat = month ? `%Y-%m` : `%Y`;
  const dateValue = month ? `${year}-${month}` : year;

  const baseQuery = sql`SELECT * FROM ${jurnalTable} WHERE strftime(${dateFormat}, ${jurnalTable.createdAt}) = ${dateValue}`;

  const query = noAkun ? baseQuery.append(sql` AND ${jurnalTable.noAkun} = ${noAkun}`) : baseQuery;

  await db.run(query);
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
