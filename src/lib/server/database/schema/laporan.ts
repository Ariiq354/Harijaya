import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { fakturPembelianTable } from './pembelian';
import { fakturPenjualanTable } from './penjualan';

export const bukuBesarTable = sqliteTable('buku_besar', {
  id: text('id').notNull().primaryKey(),
  kodeTransaksi: text('kode_transaksi').notNull(),
  akun: text('akun').notNull(),
  tanggal: text('kategoriAkun').notNull(),
  debit: integer('debit').notNull(),
  kredit: integer('kredit').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});
