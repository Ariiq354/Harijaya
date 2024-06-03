import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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

export type selectAkun = typeof akunTable.$inferSelect;

export type selectJurnal = typeof jurnalTable.$inferSelect;
