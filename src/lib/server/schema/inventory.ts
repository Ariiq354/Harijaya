import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { barangTable } from './penjualan';

export const stokBahanMentahTable = sqliteTable('stok_bahan_mentah', {
  id: text('id').notNull().primaryKey(),
  barangId: text('barang_id').references(() => barangTable.id, { onDelete: 'set null' }),
  stok: integer('stok').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const stokBarangJadiTable = sqliteTable('stok_barang_jadi', {
  id: text('id').notNull().primaryKey(),
  barangId: text('barang_id').references(() => barangTable.id, { onDelete: 'set null' }),
  stok: integer('stok').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const prosesTable = sqliteTable('proses', {
  id: text('id').notNull().primaryKey(),
  noProses: text('no_proses').notNull(),
  tanggal: text('tanggal').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const prosesProdukTable = sqliteTable('proses_produk', {
  id: text('id').notNull().primaryKey(),
  prosesId: text('proses_id')
    .notNull()
    .references(() => prosesTable.id, { onDelete: 'cascade' }),
  barangId: text('barang_id').references(() => barangTable.id, { onDelete: 'set null' }),
  kuantitas: integer('kuantitas').notNull(),
  tipeBarang: text('tipe_barang').notNull(), // 0: barang mentah, 1: barang jadi
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const stokFisikTable = sqliteTable('stok_fisik', {
  id: text('id').notNull().primaryKey(),
  noStokFisik: text('no_stok_fisik').notNull(),
  tanggal: text('tanggal').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const stokFisikProdukTable = sqliteTable('stok_fisik_produk', {
  id: text('id').notNull().primaryKey(),
  stokFisikId: text('stok_fisik_id')
    .notNull()
    .references(() => stokFisikTable.id, { onDelete: 'cascade' }),
  barangId: text('barang_id').references(() => barangTable.id, { onDelete: 'set null' }),
  kuantitas: integer('kuantitas').notNull(),
  tipe: integer('tipe').notNull(), // 0: kurang, 1: tambah
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const stokBahanMentahRelations = relations(stokBahanMentahTable, ({ one }) => ({
  barang: one(barangTable, {
    fields: [stokBahanMentahTable.barangId],
    references: [barangTable.id]
  })
}));

export const stokBahanJadiRelations = relations(stokBarangJadiTable, ({ one }) => ({
  barang: one(barangTable, {
    fields: [stokBarangJadiTable.barangId],
    references: [barangTable.id]
  })
}));

export const prosesRelations = relations(prosesTable, ({ one, many }) => ({
  produkProses: many(prosesProdukTable)
}));

export const prosesProdukRelations = relations(prosesProdukTable, ({ one }) => ({
  proses: one(prosesTable, {
    fields: [prosesProdukTable.prosesId],
    references: [prosesTable.id]
  }),
  barang: one(barangTable, {
    fields: [prosesProdukTable.barangId],
    references: [barangTable.id]
  })
}));

export const stokFisiRelations = relations(stokFisikTable, ({ one, many }) => ({
  produkStok: many(stokFisikProdukTable)
}));

export const stokFisikProdukRelations = relations(stokFisikProdukTable, ({ one }) => ({
  stokFisik: one(stokFisikTable, {
    fields: [stokFisikProdukTable.stokFisikId],
    references: [stokFisikTable.id]
  }),
  barang: one(barangTable, {
    fields: [stokFisikProdukTable.barangId],
    references: [barangTable.id]
  })
}));

export type stokBahanMentah = typeof stokBahanMentahTable.$inferSelect;

export type stokBarangJadi = typeof stokBarangJadiTable.$inferSelect;
