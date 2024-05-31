import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { pemesananPembelianTable } from './pembelian';
import { sql } from 'drizzle-orm';

export const penerimaanTable = sqliteTable('penerimaan', {
  id: text('id').notNull().primaryKey(),
  pemesananPembelianId: text('pemesanan_pembelian_id').references(
    () => pemesananPembelianTable.id,
    { onDelete: 'set null' }
  ),
  noSuratJalan: text('no_surat_jalan').notNull(),
  tanggal: text('tanggal').notNull(),
  noPelacakan: text('no_pelacakan').notNull(),
  jenis: text('jenis').notNull(),
  status: integer('status').notNull().default(1),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});
