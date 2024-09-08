import { db } from '$lib/server/database';
import {
  akunTable,
  jurnalTable,
  type Jurnal,
  type NewJurnal
} from '$lib/server/database/schema/keuangan';
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

type tableJurnalType = {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  tanggal: string;
  deskripsi: string;
  kode_transaksi: string;
  no_referensi: string;
  nominal: number;
  no_akun: string | null;
};

export async function getJurnalById(id: string) {
  const data = await db.query.jurnalTable.findFirst({
    where: (jurnal, { eq }) => eq(jurnal.id, id)
  });
  return data;
}

export async function getJurnalByPeriod(start: string, end: string, noAkun?: string) {
  const baseQuery = sql`SELECT * FROM ${jurnalTable} WHERE strftime('%Y-%m-%d', ${jurnalTable.createdAt}) BETWEEN ${start} AND ${end}`;

  const query = noAkun ? baseQuery.append(sql` AND ${jurnalTable.noAkun} = ${noAkun}`) : baseQuery;

  const data: tableJurnalType[] = await db.all(query);
  return data;
}

export async function getJurnalByDate(year: string, month?: string | null, noAkun?: string | null) {
  const dateFormat = month ? `%Y-%m` : `%Y`;
  const dateValue = month ? `${year}-${month}` : year;

  const baseQuery = sql`SELECT * FROM ${jurnalTable} WHERE strftime(${dateFormat}, ${jurnalTable.createdAt}) = ${dateValue}`;

  const query = noAkun ? baseQuery.append(sql` AND ${jurnalTable.noAkun} = ${noAkun}`) : baseQuery;

  const data: tableJurnalType[] = await db.all(query);
  return data;
}

export async function getTotalJurnalBeforePeriod(start: string, noAkun?: string) {
  const baseQuery = sql`SELECT SUM(${jurnalTable.nominal}) as totalNominal FROM ${jurnalTable} WHERE strftime('%Y-%m-%d', ${jurnalTable.createdAt}) < ${start}`;

  const query = noAkun ? baseQuery.append(sql` AND ${jurnalTable.noAkun} = ${noAkun}`) : baseQuery;

  const data: { totalNominal: string }[] = await db.all(query);
  return data[0].totalNominal ? data[0].totalNominal : 0;
}

export async function getTotalJurnalBeforeDate(
  year: string,
  month?: string | null,
  noAkun?: string | null
) {
  const dateFormat = month ? `%Y-%m` : `%Y`;
  const dateValue = month ? `${year}-${month}` : year;

  const baseQuery = sql`SELECT SUM(${jurnalTable.nominal}) as totalNominal FROM ${jurnalTable} WHERE strftime(${dateFormat}, ${jurnalTable.createdAt}) < ${dateValue}`;

  const query = noAkun ? baseQuery.append(sql` AND ${jurnalTable.noAkun} = ${noAkun}`) : baseQuery;

  const data: { totalNominal: string }[] = await db.all(query);
  return data[0].totalNominal ? data[0].totalNominal : 0;
}

export async function getTotalJurnalAfterDate(
  year: string,
  month?: string | null,
  noAkun?: string | null
) {
  const dateFormat = month ? `%Y-%m` : `%Y`;
  const dateValue = month ? `${year}-${month}` : year;
  let nextYear = year;
  let nextMonth = month;

  // Handle month increment with rollover
  if (month) {
    nextMonth = ((parseInt(month) % 12) + 1).toString(); // Increment month and handle rollover
    nextYear = (month === '12' ? parseInt(year) + 1 : year).toString(); // Increment year if month is 12
  }

  // Format next date with incremented values
  const dateValuePlus1 = nextMonth ? `${nextYear}-${String(nextMonth).padStart(2, '0')}` : nextYear;

  const baseQuery = sql`SELECT SUM(${jurnalTable.nominal}) as totalNominal FROM ${jurnalTable} WHERE strftime(${dateFormat}, ${jurnalTable.createdAt}) >= ${dateValue} AND strftime(${dateFormat}, ${jurnalTable.createdAt}) <= ${dateValuePlus1}`;

  const query = noAkun ? baseQuery.append(sql` AND ${jurnalTable.noAkun} = ${noAkun}`) : baseQuery;

  const data: { totalNominal: string }[] = await db.all(query);
  return data[0].totalNominal ? data[0].totalNominal : 0;
}

export async function getTotalJurnalByDate(year: string, month?: string | null) {
  type resType = {
    nama_akun: string;
    totalNominal: number;
  };

  const dateFormat = month ? `%Y-%m` : `%Y`;
  const dateValue = month ? `${year}-${month}` : year;

  const query = sql`SELECT ${akunTable.nama}, SUM(${jurnalTable.nominal}) as totalNominal FROM ${jurnalTable}
  INNER JOIN ${akunTable} ON ${jurnalTable.noAkun} = ${akunTable.kode}
  WHERE strftime(${dateFormat}, ${jurnalTable.createdAt}) = ${dateValue}
  GROUP BY ${akunTable.nama}`;

  const data: resType[] = await db.all(query);
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
