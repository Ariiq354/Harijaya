import { relations, sql } from 'drizzle-orm';
import { text, integer, sqliteTable, int } from 'drizzle-orm/sqlite-core';

// Auth
export const userTable = sqliteTable('user', {
  id: text('id').notNull().primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const sessionTable = sqliteTable('session', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull()
});

// Keuangan
export const akunTable = sqliteTable('akun', {
  id: text('id').notNull().primaryKey(),
  kode: text('kode_akun').notNull().unique(),
  nama: text('nama_akun').notNull(),
  kategori: text('kategoriAkun').notNull(),
  deskripsi: text('deskripsi').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const jurnalTable = sqliteTable('jurnal', {
  id: text('id').notNull().primaryKey(),
  kodeTransaksi: text('kode_transaksi').notNull().unique(),
  tanggal: text('tanggal').notNull(),
  noReferensi: text('no_referensi').notNull(),
  nominal: text('nominal').notNull(),
  deskripsi: text('deskripsi').notNull(),
  akunDebit: text('akun_debit').references(() => akunTable.id, { onDelete: 'set null' }),
  akunKredit: text('akun_kredit').references(() => akunTable.id, { onDelete: 'set null' }),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

// Pembelian
export const pemasokTable = sqliteTable('pemasok', {
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
  supplierId: text('supplier_id').references(() => pemasokTable.id, { onDelete: 'set null' }),
  noPemesanan: text('no_pemesanan').notNull(),
  tanggal: text('tanggal').notNull(),
  userId: text('user_id').references(() => userTable.id, { onDelete: 'set null' }),
  lampiran: text('lampiran').notNull(),
  ppn: int('ppn', { mode: 'boolean' }).notNull(), // 0: tidak, 1: iya
  total: int('total').notNull(),
  status: int('status').notNull().default(1), // 1: disetujui, 2: penagihan, 3: pengiriman
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const pemesananProdukTable = sqliteTable('pemesanan_produk', {
  id: text('id').notNull().primaryKey(),
  pemesananId: text('pemesanan_id')
    .notNull()
    .references(() => pemesananPembelianTable.id, { onDelete: 'cascade' }),
  barangId: text('barang_id').references(() => barangTable.id, { onDelete: 'set null' }),
  kuantitas: int('kuantitas').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const fakturPemesananTable = sqliteTable('faktur_pemesanan', {
  id: text('id').notNull().primaryKey(),
  pemesananId: text('pemesanan_id')
    .notNull()
    .references(() => pemesananPembelianTable.id, { onDelete: 'cascade' }),
  noFaktur: text('no_faktur').notNull(),
  tanggal: text('tanggal').notNull(),
  supplierId: text('supplier_id').references(() => pemasokTable.id, { onDelete: 'set null' }),
  catatan: text('catatan').notNull(),
  biayaKirim: int('biaya_kirim').notNull(),
  biayaLainnya: int('biaya_lainnya').notNull(),
  total: int('total').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

// Penjualan
export const barangTable = sqliteTable('barang', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull().unique(),
  harga: int('harga').notNull(),
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
  noPenjualan: text('no_penjualan').notNull(),
  tanggal: text('tanggal').notNull(),
  userId: text('user_id').references(() => userTable.id, { onDelete: 'set null' }),
  lampiran: text('lampiran').notNull(),
  ppn: int('ppn', { mode: 'boolean' }).notNull(), // 0: tidak, 1: iya
  pembulatan: int('pembulatan').notNull(),
  total: int('total').notNull(),
  status: int('status').notNull().default(1), // 1: disetujui, 2: penagihan, 3: pengiriman
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const penjualanProdukTable = sqliteTable('penjualan_produk', {
  id: text('id').notNull().primaryKey(),
  penjualanId: text('penjualan_id')
    .notNull()
    .references(() => pemesananPenjualanTable.id, { onDelete: 'cascade' }),
  barangId: text('barang_id').references(() => barangTable.id, { onDelete: 'set null' }),
  kuantitas: int('kuantitas').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const fakturPenjualanTable = sqliteTable('faktur_penjualan', {
  id: text('id').notNull().primaryKey(),
  penjualanId: text('penjualan_id')
    .notNull()
    .references(() => pemesananPenjualanTable.id, { onDelete: 'cascade' }),
  noFaktur: text('no_faktur').notNull(),
  tanggal: text('tanggal').notNull(),
  pelangganId: text('pelanggan_id').references(() => pelangganTable.id, { onDelete: 'set null' }),
  catatan: text('catatan').notNull(),
  biayaKirim: int('biaya_kirim').notNull(),
  biayaLainnya: int('biaya_lainnya').notNull(),
  pembulatan: int('pembulatan').notNull(),
  total: int('total').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

// Inventory

export const penerimaanTable = sqliteTable('penerimaan', {
  id: text('id').notNull().primaryKey(),
  pemesananPembelianId: text('pemesanan_pembelian_id').references(
    () => pemesananPembelianTable.id,
    { onDelete: 'set null' }
  ),
  noSuratJalan: text('no_surat_jalan').notNull(),
  tanggal: text('tanggal').notNull(),
  noPelacakan: text('no_pelacakan').notNull(),
  jenis: text('jenis').notNull(),
  status: int('status').notNull().default(1),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

// Relations
export const jurnalRelations = relations(jurnalTable, ({ one }) => ({
  akunDebit: one(akunTable, {
    fields: [jurnalTable.akunDebit],
    references: [akunTable.id]
  }),
  akunKredit: one(akunTable, {
    fields: [jurnalTable.akunKredit],
    references: [akunTable.id]
  })
}));

export const supplierRelations = relations(pemasokTable, ({ many }) => ({
  pemesananPembelian: many(pemesananPembelianTable)
}));

export const pemesananPembelianRelations = relations(pemesananPembelianTable, ({ one, many }) => ({
  supplier: one(pemasokTable, {
    fields: [pemesananPembelianTable.supplierId],
    references: [pemasokTable.id]
  }),
  produk: many(pemesananProdukTable)
}));

export const pemesananProdukRelations = relations(pemesananProdukTable, ({ one }) => ({
  pemesananPembelian: one(pemesananPembelianTable, {
    fields: [pemesananProdukTable.pemesananId],
    references: [pemesananPembelianTable.id]
  }),
  barang: one(barangTable, {
    fields: [pemesananProdukTable.barangId],
    references: [barangTable.id]
  })
}));

export const fakturPemesananRelations = relations(fakturPemesananTable, ({ one }) => ({
  pemesananPembelian: one(pemesananPembelianTable, {
    fields: [fakturPemesananTable.pemesananId],
    references: [pemesananPembelianTable.id]
  }),
  supplier: one(pemasokTable, {
    fields: [fakturPemesananTable.supplierId],
    references: [pemasokTable.id]
  })
}));

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

// Type exports
export type selectJurnal = typeof jurnalTable.$inferSelect;

export type selectAkun = typeof akunTable.$inferSelect;

export type selectPemasok = typeof pemasokTable.$inferSelect;

export type selectBarang = typeof barangTable.$inferSelect;

export type selectPelanggan = typeof pelangganTable.$inferSelect;

export type selectPemesananPembelian = typeof pemesananPembelianTable.$inferSelect;

export type selectFaktur = typeof fakturPemesananTable.$inferSelect;

export type selectPemesananPenjualan = typeof pemesananPenjualanTable.$inferSelect;

export type selectFakturPenjualan = typeof fakturPenjualanTable.$inferSelect;
