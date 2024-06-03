import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { userTable } from './auth';
import { barangTable } from './penjualan';

export const supplierTable = sqliteTable('supplier', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull().unique(),
  email: text('email').notNull(),
  npwp: text('npwp').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  namaBank: text('nama_bank').notNull(),
  atasNama: text('atas_nama').notNull(),
  noRekening: text('no_rekening').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const pemesananPembelianTable = sqliteTable('pemesanan_pembelian', {
  id: text('id').notNull().primaryKey(),
  supplierId: text('supplier_id').references(() => supplierTable.id, { onDelete: 'set null' }),
  noPembelian: text('no_pembelian').notNull().unique(),
  tanggal: text('tanggal').notNull(),
  userId: text('user_id').references(() => userTable.id, { onDelete: 'set null' }),
  lampiran: text('lampiran').notNull(),
  ppn: integer('ppn', { mode: 'boolean' }).notNull(), // 0: tidak, 1: iya
  total: integer('total').notNull(),
  status: integer('status').notNull().default(0), // 0: disetujui, 1: sudah Faktur (penagihan), 2: sudah surat jalan (pengiriman), 3: selesai
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const pembelianProdukTable = sqliteTable('pembelian_produk', {
  id: text('id').notNull().primaryKey(),
  pembelianId: text('pembelian_id')
    .notNull()
    .references(() => pemesananPembelianTable.id, { onDelete: 'cascade' }),
  barangId: text('barang_id').references(() => barangTable.id, { onDelete: 'set null' }),
  kuantitas: integer('kuantitas').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const fakturPembelianTable = sqliteTable('faktur_pembelian', {
  id: text('id').notNull().primaryKey(),
  pembelianId: text('pembelian_id').references(() => pemesananPembelianTable.id, {
    onDelete: 'set null'
  }),
  noFaktur: text('no_faktur').notNull(),
  tanggal: text('tanggal').notNull(),
  supplierId: text('supplier_id').references(() => supplierTable.id, { onDelete: 'set null' }),
  catatan: text('catatan').notNull(),
  biayaKirim: integer('biaya_kirim').notNull(),
  biayaLainnya: integer('biaya_lainnya').notNull(),
  total: integer('total').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const pemesananPembelianRelations = relations(pemesananPembelianTable, ({ one, many }) => ({
  supplier: one(supplierTable, {
    fields: [pemesananPembelianTable.supplierId],
    references: [supplierTable.id]
  }),
  produk: many(pembelianProdukTable)
}));

export const pembelianProdukRelations = relations(pembelianProdukTable, ({ one }) => ({
  pemesananPembelian: one(pemesananPembelianTable, {
    fields: [pembelianProdukTable.pembelianId],
    references: [pemesananPembelianTable.id]
  }),
  barang: one(barangTable, {
    fields: [pembelianProdukTable.barangId],
    references: [barangTable.id]
  })
}));

export const fakturPembelianRelations = relations(fakturPembelianTable, ({ one }) => ({
  pemesananPembelian: one(pemesananPembelianTable, {
    fields: [fakturPembelianTable.pembelianId],
    references: [pemesananPembelianTable.id]
  }),
  supplier: one(supplierTable, {
    fields: [fakturPembelianTable.supplierId],
    references: [supplierTable.id]
  })
}));

export type selectSupplier = typeof supplierTable.$inferSelect;

export type selectPemesananPembelian = typeof pemesananPembelianTable.$inferSelect;

export type selectFakturPembelian = typeof fakturPembelianTable.$inferSelect;
