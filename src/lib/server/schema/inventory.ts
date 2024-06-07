import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { pemesananPembelianTable, supplierTable } from './pembelian';
import { relations, sql } from 'drizzle-orm';
import { barangTable, pelangganTable, pemesananPenjualanTable } from './penjualan';

export const stokTable = sqliteTable('stok', {
  id: text('id').notNull().primaryKey(),
  barangId: text('barang_id')
    .notNull()
    .references(() => barangTable.id, { onDelete: 'cascade' }),
  stok: integer('stok').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

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

export const stokFisikTable = sqliteTable('stok_fisik', {
  id: text('id').notNull().primaryKey(),
  tanggal: text('tanggal').notNull(),
  deskripsi: text('deskripsi').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const stokFisikProductTable = sqliteTable('stok_fisik_product', {
  id: text('id').notNull().primaryKey(),
  barangId: text('barang_id').references(() => barangTable.id, { onDelete: 'set null' }),
  stokFisikId: text('stok_fisik_id')
    .notNull()
    .references(() => stokFisikTable.id, { onDelete: 'cascade' }),
  type: integer('type', { mode: 'boolean' }).notNull(), // 0: tambah, 1: kurang
  kuantitas: integer('kuantitas').notNull(), // 0: tambah, 1: kurang
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const stokFisikRelations = relations(stokFisikTable, ({ many }) => ({
  stok: many(stokFisikProductTable)
}));

export const stokRelations = relations(stokTable, ({ one }) => ({
  barang: one(barangTable, {
    fields: [stokTable.barangId],
    references: [barangTable.id]
  })
}));

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
  pemesananPenjualan: one(pemesananPenjualanTable, {
    fields: [pengirimanTable.pemesananPenjualanId],
    references: [pemesananPenjualanTable.id]
  }),
  pelangganId: one(pelangganTable, {
    fields: [pengirimanTable.pelangganId],
    references: [pelangganTable.id]
  })
}));
