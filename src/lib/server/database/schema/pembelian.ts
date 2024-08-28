import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './auth';
import { pembayaranUtangItemTable } from './keuangan';
import { barangTable } from './penjualan';

export const supplierTable = sqliteTable('supplier', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  npwp: text('npwp').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  namaBank: text('nama_bank').notNull(),
  namaRekening: text('nama_rekening').notNull(),
  noRekening: text('no_rekening').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const fakturPembelianTable = sqliteTable('faktur_pembelian', {
  id: text('id').notNull().primaryKey(),
  supplierId: text('supplier_id').references(() => supplierTable.id, { onDelete: 'set null' }),
  noFaktur: text('no_faktur').notNull().unique(),
  tanggal: text('tanggal').notNull(),
  userId: text('user_id').references(() => userTable.id, { onDelete: 'set null' }),
  lampiran: text('lampiran').notNull(),
  biayaKirim: integer('biaya_kirim').notNull(),
  catatan: text('catatan').notNull(),
  biayaLainnya: integer('biaya_lainnya').notNull(),
  total: integer('total').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const pembelianProdukTable = sqliteTable('pembelian_produk', {
  id: text('id').notNull().primaryKey(),
  noPembelian: text('no_pembelian')
    .notNull()
    .references(() => fakturPembelianTable.noFaktur, { onDelete: 'cascade' }),
  barangId: text('barang_id')
    .notNull()
    .references(() => barangTable.id, { onDelete: 'cascade' }),
  harga: integer('harga').notNull(),
  kuantitas: integer('kuantitas').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const fakturPembelianRelations = relations(fakturPembelianTable, ({ one, many }) => ({
  supplier: one(supplierTable, {
    fields: [fakturPembelianTable.supplierId],
    references: [supplierTable.id]
  }),
  produk: many(pembelianProdukTable),
  pembayaran: many(pembayaranUtangItemTable)
}));

export const pembelianProdukRelations = relations(pembelianProdukTable, ({ one }) => ({
  fakturPembelian: one(fakturPembelianTable, {
    fields: [pembelianProdukTable.noPembelian],
    references: [fakturPembelianTable.noFaktur]
  }),
  barang: one(barangTable, {
    fields: [pembelianProdukTable.barangId],
    references: [barangTable.id]
  })
}));

export type Supplier = typeof supplierTable.$inferSelect;
export type NewSupplier = typeof supplierTable.$inferInsert;

export type FakturPembelian = typeof fakturPembelianTable.$inferSelect;
export type NewFakturPembelian = typeof fakturPembelianTable.$inferInsert;

export type PembelianProduk = typeof pembelianProdukTable.$inferSelect;
export type NewPembelianProduk = typeof pembelianProdukTable.$inferInsert;
