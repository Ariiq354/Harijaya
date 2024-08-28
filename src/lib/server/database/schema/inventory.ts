import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { barangTable } from './penjualan';

// SCHEMA
export const prosesTable = sqliteTable('proses', {
  id: text('id').notNull().primaryKey(),
  noProses: text('no_proses').notNull().unique(),
  tanggal: text('tanggal').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const prosesProdukTable = sqliteTable('proses_produk', {
  id: text('id').notNull().primaryKey(),
  noProses: text('no_proses')
    .notNull()
    .references(() => prosesTable.noProses, { onDelete: 'cascade' }),
  barangId: text('barang_id')
    .notNull()
    .references(() => barangTable.id, { onDelete: 'cascade' }),
  harga: integer('harga').notNull(),
  kuantitas: integer('kuantitas').notNull(),
  tipeBarang: integer('tipe_barang').notNull(), // 1: barang mentah, 2: barang jadi
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const stokFisikTable = sqliteTable('stok_fisik', {
  id: text('id').notNull().primaryKey(),
  noStokFisik: text('no_stok_fisik').notNull().unique(),
  tanggal: text('tanggal').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const stokFisikProdukTable = sqliteTable('stok_fisik_produk', {
  id: text('id').notNull().primaryKey(),
  noStokFisik: text('noStokFisik')
    .notNull()
    .references(() => stokFisikTable.noStokFisik, { onDelete: 'cascade' }),
  barangId: text('barang_id')
    .notNull()
    .references(() => barangTable.id, { onDelete: 'cascade' }),
  kuantitas: integer('kuantitas').notNull(),
  harga: integer('harga').notNull(),
  tipe: integer('tipe').notNull(), // 1: kurang, 2: tambah
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

// RELATIONS
export const prosesRelations = relations(prosesTable, ({ many }) => ({
  produkProses: many(prosesProdukTable)
}));

export const prosesProdukRelations = relations(prosesProdukTable, ({ one }) => ({
  proses: one(prosesTable, {
    fields: [prosesProdukTable.noProses],
    references: [prosesTable.noProses]
  }),
  barang: one(barangTable, {
    fields: [prosesProdukTable.barangId],
    references: [barangTable.id]
  })
}));

export const stokFisiRelations = relations(stokFisikTable, ({ many }) => ({
  produkStok: many(stokFisikProdukTable)
}));

export const stokFisikProdukRelations = relations(stokFisikProdukTable, ({ one }) => ({
  stokFisik: one(stokFisikTable, {
    fields: [stokFisikProdukTable.noStokFisik],
    references: [stokFisikTable.noStokFisik]
  }),
  barang: one(barangTable, {
    fields: [stokFisikProdukTable.barangId],
    references: [barangTable.id]
  })
}));

// TYPE
export type Proses = typeof prosesTable.$inferSelect;
export type NewProses = typeof prosesTable.$inferInsert;

export type ProsesProduk = typeof prosesProdukTable.$inferSelect;
export type NewProsesProduk = typeof prosesProdukTable.$inferInsert;

export type StokFisik = typeof stokFisikTable.$inferSelect;
export type NewStokFisik = typeof stokFisikTable.$inferInsert;

export type StokFisikProduk = typeof stokFisikProdukTable.$inferSelect;
export type NewStokFisikProduk = typeof stokFisikProdukTable.$inferInsert;
