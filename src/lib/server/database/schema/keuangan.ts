import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { fakturPembelianTable } from './pembelian';
import { fakturPenjualanTable } from './penjualan';

export const akunTable = sqliteTable('akun', {
  id: text('id').notNull().primaryKey(),
  kode: text('kode_akun').notNull().unique(),
  nama: text('nama_akun').notNull().unique(),
  kategori: text('kategoriAkun').notNull(),
  deskripsi: text('deskripsi').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const jurnalTable = sqliteTable('jurnal', {
  id: text('id').notNull().primaryKey(),
  kodeTransaksi: text('kode_transaksi').notNull(),
  tanggal: text('tanggal').notNull(),
  noReferensi: text('no_referensi').notNull(),
  nominal: integer('nominal').notNull(),
  deskripsi: text('deskripsi').notNull(),
  noAkun: text('no_akun').references(() => akunTable.kode, { onDelete: 'set null' }),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const utangTable = sqliteTable('utang', {
  id: text('id').notNull().primaryKey(),
  noFaktur: text('no_faktur')
    .notNull()
    .references(() => fakturPembelianTable.noFaktur, { onDelete: 'cascade' }),
  nilai: integer('nilai').notNull(),
  sisa: integer('sisa').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const pembayaranUtangTable = sqliteTable('pembayaran_utang', {
  id: text('id').notNull().primaryKey(),
  noPembayaran: text('no_pembayaran').notNull().unique(),
  totalNilai: integer('nilai').notNull(),
  tanggal: text('tangal').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const pembayaranUtangItemTable = sqliteTable('pembayaran_utang_item', {
  id: text('id').notNull().primaryKey(),
  noPembayaran: text('no_pembayaran')
    .notNull()
    .references(() => pembayaranUtangTable.id, { onDelete: 'cascade' }),
  noFaktur: text('no_faktur').references(() => fakturPembelianTable.noFaktur, {
    onDelete: 'set null'
  }),
  nilai: integer('nilai').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const piutangTable = sqliteTable('piutang', {
  id: text('id').notNull().primaryKey(),
  noFaktur: text('no_faktur')
    .notNull()
    .references(() => fakturPenjualanTable.noFaktur, { onDelete: 'cascade' }),
  nilai: integer('nilai').notNull(),
  sisa: integer('sisa').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const pembayaranPiutangTable = sqliteTable('pembayaran_piutang', {
  id: text('id').notNull().primaryKey(),
  noPembayaran: text('no_pembayaran').notNull().unique(),
  totalNilai: integer('nilai').notNull(),
  tanggal: text('tangal').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const pembayaranPiutangItemTable = sqliteTable('pembayaran_piutang_item', {
  id: text('id').notNull().primaryKey(),
  noPembayaran: text('no_pembayaran')
    .notNull()
    .references(() => pembayaranPiutangTable.noPembayaran, { onDelete: 'cascade' }),
  noFaktur: text('no_faktur').references(() => fakturPenjualanTable.noFaktur, {
    onDelete: 'set null'
  }),
  nilai: integer('nilai').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const jurnalRelations = relations(jurnalTable, ({ one }) => ({
  akun: one(akunTable, {
    fields: [jurnalTable.noAkun],
    references: [akunTable.kode]
  })
}));

export const utangRelations = relations(utangTable, ({ one }) => ({
  fakturPembelian: one(fakturPembelianTable, {
    fields: [utangTable.noFaktur],
    references: [fakturPembelianTable.noFaktur]
  })
}));

export const pembayaranUtangRelations = relations(pembayaranUtangTable, ({ many }) => ({
  utangItem: many(pembayaranUtangItemTable)
}));

export const pembayaranUtangItemRelations = relations(pembayaranUtangItemTable, ({ one }) => ({
  pembayaran: one(pembayaranUtangTable, {
    fields: [pembayaranUtangItemTable.noPembayaran],
    references: [pembayaranUtangTable.noPembayaran]
  }),
  faktur: one(fakturPembelianTable, {
    fields: [pembayaranUtangItemTable.noFaktur],
    references: [fakturPembelianTable.noFaktur]
  })
}));

export const piutangRelations = relations(piutangTable, ({ one }) => ({
  fakturPembelian: one(fakturPenjualanTable, {
    fields: [piutangTable.noFaktur],
    references: [fakturPenjualanTable.noFaktur]
  })
}));

export const pembayaranPiutangRelations = relations(pembayaranPiutangTable, ({ many }) => ({
  piutangItem: many(pembayaranPiutangItemTable)
}));

export const pembayaranPiutangItemRelations = relations(pembayaranPiutangItemTable, ({ one }) => ({
  pembayaran: one(pembayaranPiutangTable, {
    fields: [pembayaranPiutangItemTable.noPembayaran],
    references: [pembayaranPiutangTable.noPembayaran]
  }),
  faktur: one(fakturPenjualanTable, {
    fields: [pembayaranPiutangItemTable.noFaktur],
    references: [fakturPenjualanTable.noFaktur]
  })
}));

export type Akun = typeof akunTable.$inferSelect;
export type NewAkun = typeof akunTable.$inferInsert;

export type Jurnal = typeof jurnalTable.$inferSelect;
export type NewJurnal = typeof jurnalTable.$inferInsert;

export type Utang = typeof utangTable.$inferSelect;
export type NewUtang = typeof utangTable.$inferInsert;

export type Piutang = typeof piutangTable.$inferSelect;
export type NewPiutang = typeof piutangTable.$inferInsert;

export type PembayaranUtang = typeof pembayaranUtangTable.$inferSelect;
export type NewPembayaranUtang = typeof pembayaranUtangTable.$inferInsert;

export type PembayaranPiutang = typeof pembayaranPiutangTable.$inferSelect;
export type NewPembayaranPiutang = typeof pembayaranPiutangTable.$inferInsert;
