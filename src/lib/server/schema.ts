import { relations, sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

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

export const pemasokTable = sqliteTable('pemasok', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull().unique(),
  email: text('email').notNull(),
  npwp: text('npwp').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

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

export const pemesananPembelianTable = sqliteTable('pemesanan_pembelian', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull().unique(),
  email: text('email').notNull(),
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

// Type exports
export type selectJurnal = typeof jurnalTable.$inferSelect;

export type selectPemasok = typeof pemasokTable.$inferSelect;

export type selectAkun = typeof akunTable.$inferSelect;
