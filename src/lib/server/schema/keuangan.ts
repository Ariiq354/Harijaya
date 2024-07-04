import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { fakturPembelianTable } from './pembelian';
import { fakturPenjualanTable } from './penjualan';

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
  nominal: integer('nominal').notNull(),
  deskripsi: text('deskripsi').notNull(),
  akunDebit: text('akun_debit').references(() => akunTable.id, { onDelete: 'set null' }),
  akunKredit: text('akun_kredit').references(() => akunTable.id, { onDelete: 'set null' }),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const utangTable = sqliteTable('utang', {
  id: text('id').notNull().primaryKey(),
  noFaktur: text('no_faktur')
    .notNull()
    .references(() => fakturPembelianTable.id, { onDelete: 'cascade' }),
  nilai: integer('nilai').notNull(),
  sisa: integer('sisa').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const pembayaranUtangTable = sqliteTable('pembayaran_utang', {
  id: text('id').notNull().primaryKey(),
  noTransaksi: text('no_transaksi').notNull(),
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
  noUtang: text('no_utang').references(() => utangTable.id, { onDelete: 'set null' }),
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
    .references(() => fakturPenjualanTable.id, { onDelete: 'cascade' }),
  nilai: integer('nilai').notNull(),
  sisa: integer('sisa').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const pembayaranPiutangTable = sqliteTable('pembayaran_piutang', {
  id: text('id').notNull().primaryKey(),
  noTransaksi: text('no_transaksi').notNull(),
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
    .references(() => pembayaranPiutangTable.id, { onDelete: 'cascade' }),
  noPiutang: text('no_piutang').references(() => piutangTable.id, { onDelete: 'set null' }),
  nilai: integer('nilai').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

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

export const utangRelations = relations(utangTable, ({ one }) => ({
  fakturPembelian: one(fakturPembelianTable, {
    fields: [utangTable.noFaktur],
    references: [fakturPembelianTable.id]
  })
}));

export const pembayaranUtangRelations = relations(pembayaranUtangTable, ({ many }) => ({
  utangItem: many(pembayaranUtangItemTable)
}));

export const pembayaranUtangItemRelations = relations(pembayaranUtangItemTable, ({ one }) => ({
  pembayaran: one(pembayaranUtangTable, {
    fields: [pembayaranUtangItemTable.noPembayaran],
    references: [pembayaranUtangTable.id]
  }),
  utang: one(utangTable, {
    fields: [pembayaranUtangItemTable.noUtang],
    references: [utangTable.id]
  })
}));

export const piutangRelations = relations(piutangTable, ({ one }) => ({
  fakturPembelian: one(fakturPenjualanTable, {
    fields: [piutangTable.noFaktur],
    references: [fakturPenjualanTable.id]
  })
}));

export const pembayaranPiutangRelations = relations(pembayaranPiutangTable, ({ many }) => ({
  piutangItem: many(pembayaranPiutangItemTable)
}));

export const pembayaranPiutangItemRelations = relations(pembayaranPiutangItemTable, ({ one }) => ({
  pembayaran: one(pembayaranPiutangTable, {
    fields: [pembayaranPiutangItemTable.noPembayaran],
    references: [pembayaranPiutangTable.id]
  }),
  piutang: one(piutangTable, {
    fields: [pembayaranPiutangItemTable.noPiutang],
    references: [piutangTable.id]
  })
}));

export type selectAkun = typeof akunTable.$inferSelect;

export type selectJurnal = typeof jurnalTable.$inferSelect;

export type selectUtang = typeof utangTable.$inferSelect;

export type selectPiutang = typeof piutangTable.$inferSelect;

export type selectPembayaranUtang = typeof pembayaranUtangTable.$inferSelect;

export type selectPembayaranPiutang = typeof pembayaranPiutangTable.$inferSelect;
