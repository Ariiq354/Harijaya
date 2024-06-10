import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './auth';
import { stokBarangJadiTable, stokBahanMentahTable } from './inventory';

export const barangTable = sqliteTable('barang', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull(),
  deskripsi: text('deskripsi').notNull(),
  satuan: text('satuan').notNull(),
  tipe: integer('tipe').notNull(), // 1: mentah, 2: jadi
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
  atasNama: text('atas_nama').notNull(),
  noRekening: text('no_rekening').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const fakturPenjualanTable = sqliteTable('faktur_penjualan', {
  id: text('id').notNull().primaryKey(),
  pelangganId: text('pelanggan_id').references(() => pelangganTable.id, { onDelete: 'set null' }),
  noFaktur: text('no_faktur').notNull().unique(),
  tanggal: text('tanggal').notNull(),
  userId: text('user_id').references(() => userTable.id, { onDelete: 'set null' }),
  lampiran: text('lampiran').notNull(),
  catatan: text('catatan').notNull(),
  ppn: integer('ppn', { mode: 'boolean' }).notNull(), // 0: tidak, 1: iya
  pembulatan: integer('pembulatan').notNull(),
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
  penjualanId: text('penjualan_id')
    .notNull()
    .references(() => fakturPenjualanTable.id, {
      onDelete: 'cascade'
    }),
  barangId: text('barang_id').references(() => barangTable.id, { onDelete: 'set null' }),
  harga: integer('harga').notNull(),
  kuantitas: integer('kuantitas').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const barangRelations = relations(barangTable, ({ one, many }) => ({
  bahanMentah: one(stokBahanMentahTable, {
    fields: [barangTable.id],
    references: [stokBahanMentahTable.barangId]
  }),
  barangJadi: one(stokBarangJadiTable, {
    fields: [barangTable.id],
    references: [stokBarangJadiTable.barangId]
  })
}));

export const fakturPenjualanRelations = relations(fakturPenjualanTable, ({ one, many }) => ({
  pelanggan: one(pelangganTable, {
    fields: [fakturPenjualanTable.pelangganId],
    references: [pelangganTable.id]
  }),
  produk: many(penjualanProdukTable)
}));

export const penjualanProdukRelations = relations(penjualanProdukTable, ({ one }) => ({
  fakturPenjualan: one(fakturPenjualanTable, {
    fields: [penjualanProdukTable.penjualanId],
    references: [fakturPenjualanTable.id]
  }),
  barang: one(barangTable, {
    fields: [penjualanProdukTable.barangId],
    references: [barangTable.id]
  })
}));

export type selectBarang = typeof barangTable.$inferSelect;

export type selectPelanggan = typeof pelangganTable.$inferSelect;

export type selectFakturPenjualan = typeof fakturPenjualanTable.$inferSelect;
