import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { userTable } from './auth';
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
  noFaktur: text('no_faktur').notNull(),
  tanggal: text('tanggal').notNull(),
  userId: text('user_id').references(() => userTable.id, { onDelete: 'set null' }),
  lampiran: text('lampiran').notNull(),
  ppn: integer('ppn', { mode: 'boolean' }).notNull(), // 0: tidak, 1: iya
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
  pembelianId: text('pembelian_id')
    .notNull()
    .references(() => fakturPembelianTable.id, { onDelete: 'cascade' }),
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
  produk: many(pembelianProdukTable)
}));

export const pembelianProdukRelations = relations(pembelianProdukTable, ({ one }) => ({
  fakturPembelian: one(fakturPembelianTable, {
    fields: [pembelianProdukTable.pembelianId],
    references: [fakturPembelianTable.id]
  }),
  barang: one(barangTable, {
    fields: [pembelianProdukTable.barangId],
    references: [barangTable.id]
  })
}));

export type selectSupplier = typeof supplierTable.$inferSelect;

export type selectFakturPembelian = typeof fakturPembelianTable.$inferSelect;
