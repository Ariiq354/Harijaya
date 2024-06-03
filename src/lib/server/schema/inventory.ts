import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { pemesananPembelianTable, supplierTable } from './pembelian';
import { relations, sql } from 'drizzle-orm';
import { pelangganTable, pemesananPenjualanTable } from './penjualan';

export const penerimaanTable = sqliteTable('penerimaan', {
  id: text('id').notNull().primaryKey(),
  pemesananPembelianId: text('pemesanan_pembelian_id').references(
    () => pemesananPembelianTable.id,
    { onDelete: 'set null' }
  ),
  supplierId: text('supplier_id').references(() => supplierTable.id, { onDelete: 'set null' }),
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

export const pengirimanTable = sqliteTable('pengiriman', {
  id: text('id').notNull().primaryKey(),
  pemesananPenjualanId: text('pemesanan_penjualan_id').references(
    () => pemesananPenjualanTable.id,
    { onDelete: 'set null' }
  ),
  pelangganId: text('pelanggan_id').references(() => pelangganTable.id, { onDelete: 'set null' }),
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

export const penerimaanRelations = relations(penerimaanTable, ({ one }) => ({
  pemesananPembelian: one(pemesananPembelianTable, {
    fields: [penerimaanTable.pemesananPembelianId],
    references: [pemesananPembelianTable.id]
  }),
  supplierId: one(supplierTable, {
    fields: [penerimaanTable.supplierId],
    references: [supplierTable.id]
  })
}));

export const pengirimanRelations = relations(pengirimanTable, ({ one }) => ({
  pemesananPembelian: one(pemesananPembelianTable, {
    fields: [pengirimanTable.pemesananPenjualanId],
    references: [pemesananPembelianTable.id]
  }),
  supplierId: one(supplierTable, {
    fields: [pengirimanTable.pelangganId],
    references: [supplierTable.id]
  })
}));
