import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './auth';

export const barangTable = sqliteTable('barang', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull().unique(),
  harga: integer('harga').notNull(),
  deskripsi: text('deskripsi').notNull(),
  satuan: text('satuan').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const pelangganTable = sqliteTable('pelanggan', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull().unique(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  npwp: text('npwp').notNull(),
  address: text('address').notNull(),
  namaBank: text('nama_bank').notNull(),
  atasNama: text('atas_nama').notNull(),
  noRekening: text('no_rekening').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const pemesananPenjualanTable = sqliteTable('pemesanan_penjualan', {
  id: text('id').notNull().primaryKey(),
  pelangganId: text('pelanggan_id').references(() => pelangganTable.id, { onDelete: 'set null' }),
  noPenjualan: text('no_penjualan').notNull().unique(),
  tanggal: text('tanggal').notNull(),
  userId: text('user_id').references(() => userTable.id, { onDelete: 'set null' }),
  lampiran: text('lampiran').notNull(),
  ppn: integer('ppn', { mode: 'boolean' }).notNull(), // 0: tidak, 1: iya
  pembulatan: integer('pembulatan').notNull(),
  total: integer('total').notNull(),
  status: integer('status').notNull().default(1), // 1: disetujui, 2: penagihan, 3: pengiriman
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const penjualanProdukTable = sqliteTable('penjualan_produk', {
  id: text('id').notNull().primaryKey(),
  penjualanId: text('penjualan_id').references(() => pemesananPenjualanTable.id, {
    onDelete: 'cascade'
  }),
  barangId: text('barang_id').references(() => barangTable.id, { onDelete: 'set null' }),
  kuantitas: integer('kuantitas').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const fakturPenjualanTable = sqliteTable('faktur_penjualan', {
  id: text('id').notNull().primaryKey(),
  penjualanId: text('penjualan_id').references(() => pemesananPenjualanTable.id, {
    onDelete: 'set null'
  }),
  noFaktur: text('no_faktur').notNull(),
  tanggal: text('tanggal').notNull(),
  pelangganId: text('pelanggan_id').references(() => pelangganTable.id, { onDelete: 'set null' }),
  catatan: text('catatan').notNull(),
  biayaKirim: integer('biaya_kirim').notNull(),
  biayaLainnya: integer('biaya_lainnya').notNull(),
  pembulatan: integer('pembulatan').notNull(),
  total: integer('total').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const pemesananPenjualanRelations = relations(pemesananPenjualanTable, ({ one, many }) => ({
  pelanggan: one(pelangganTable, {
    fields: [pemesananPenjualanTable.pelangganId],
    references: [pelangganTable.id]
  }),
  produk: many(penjualanProdukTable)
}));

export const penjualanProdukRelations = relations(penjualanProdukTable, ({ one }) => ({
  pemesananPenjualan: one(pemesananPenjualanTable, {
    fields: [penjualanProdukTable.penjualanId],
    references: [pemesananPenjualanTable.id]
  }),
  barang: one(barangTable, {
    fields: [penjualanProdukTable.barangId],
    references: [barangTable.id]
  })
}));

export const fakturPenjualanRelations = relations(fakturPenjualanTable, ({ one }) => ({
  pemesananPenjualan: one(pemesananPenjualanTable, {
    fields: [fakturPenjualanTable.penjualanId],
    references: [pemesananPenjualanTable.id]
  }),
  pelanggan: one(pelangganTable, {
    fields: [fakturPenjualanTable.pelangganId],
    references: [pelangganTable.id]
  })
}));

export type selectBarang = typeof barangTable.$inferSelect;

export type selectPelanggan = typeof pelangganTable.$inferSelect;

export type selectPemesananPenjualan = typeof pemesananPenjualanTable.$inferSelect;

export type selectFakturPenjualan = typeof fakturPenjualanTable.$inferSelect;
