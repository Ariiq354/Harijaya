import { getDate } from '$lib/utils';
import { like, sql } from 'drizzle-orm';
import type { SQLiteColumn, SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core';
import { db } from './database';

export async function getNumber(
  code: string,
  table: SQLiteTableWithColumns<any>,
  column: SQLiteColumn<any>
) {
  const num = await db
    .select({
      num: sql<string>`
        CASE
          WHEN MAX(CAST(SUBSTR(${column}, -3) AS INTEGER)) ISNULL then '001'
          ELSE SUBSTR('00' || (MAX(CAST(SUBSTR(${column}, -3) AS INTEGER)) + 1), -3)
        END`
    })
    .from(table)
    .where(like(column, sql`${code + '-'} || strftime('%Y%m%d', 'now') || '-%'`));

  return code + '-' + getDate() + '-' + num[0].num;
}
