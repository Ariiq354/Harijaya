import type { SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core';

export async function getDaftarTransaksiMonthly(
  year: number,
  month: number,
  table?: SQLiteTableWithColumns<any>
) {}

export async function getDaftarTransaksiQuarterly(
  year: number,
  quarter: number,
  table?: SQLiteTableWithColumns<any>
) {}

export async function getDaftarTransaksiYearly(year: number, table?: SQLiteTableWithColumns<any>) {}
