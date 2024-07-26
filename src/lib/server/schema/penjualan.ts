import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './auth';
import { pembayaranPiutangItemTable, pembayaranPiutangTable } from './keuangan';

export const barangTable = sqliteTable('barang', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull(),
  deskripsi: text('deskripsi').notNull(),
  satuan: text('satuan').notNull(),
  tipe: integer('tipe').notNull(), // 1: mentah, 2: jadi
  status: integer('status').notNull(), // 1: tidak aktif, 2: aktif
  stok: integer('stok').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const pelangganTable = sqliteTable('pelanggan', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  npwp: text('npwp').notNull(),
  address: text('address').notNull(),
  namaBank: text('nama_bank').notNull(),
  namaRekening: text('nama_rekening').notNull(),
  noRekening: text('no_rekening').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const fakturPenjualanTable = sqliteTable('faktur_penjualan', {
  id: text('id').notNull().primaryKey(),
  pelangganId: text('pelanggan_id').references(() => pelangganTable.id, {
    onDelete: 'set null'
  }),
  noFaktur: text('no_faktur').notNull().unique(),
  tanggal: text('tanggal').notNull(),
  userId: text('user_id').references(() => userTable.id, { onDelete: 'set null' }),
  lampiran: text('lampiran').notNull(),
  catatan: text('catatan').notNull(),
  ppn: integer('ppn', { mode: 'boolean' }).notNull(), // 0: tidak, 1: iya
  biayaKirim: integer('biaya_kirim').notNull(),
  biayaLainnya: integer('biaya_lainnya').notNull(),
  total: integer('total').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const penjualanProdukTable = sqliteTable('penjualan_produk', {
  id: text('id').notNull().primaryKey(),
  noPenjualan: text('no_penjualan')
    .notNull()
    .references(() => fakturPenjualanTable.noFaktur, {
      onDelete: 'cascade'
    }),
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

export const fakturPenjualanRelations = relations(fakturPenjualanTable, ({ one, many }) => ({
  pelanggan: one(pelangganTable, {
    fields: [fakturPenjualanTable.pelangganId],
    references: [pelangganTable.id]
  }),
  produk: many(penjualanProdukTable),
  pembayaran: many(pembayaranPiutangItemTable)
}));

export const penjualanProdukRelations = relations(penjualanProdukTable, ({ one }) => ({
  fakturPenjualan: one(fakturPenjualanTable, {
    fields: [penjualanProdukTable.noPenjualan],
    references: [fakturPenjualanTable.noFaktur]
  }),
  barang: one(barangTable, {
    fields: [penjualanProdukTable.barangId],
    references: [barangTable.id]
  })
}));

export type selectBarang = typeof barangTable.$inferSelect;

export type selectPelanggan = typeof pelangganTable.$inferSelect;

export type selectFakturPenjualan = typeof fakturPenjualanTable.$inferSelect;
