import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as auth from './schema/auth';
import * as keuangan from './schema/keuangan';
import * as pembelian from './schema/pembelian';
import * as penjualan from './schema/penjualan';
import * as inventory from './schema/inventory';
// import { DATABASE_URL, DATABASE_AUTH_TOKEN } from '$env/static/private';

const client = createClient({
  url: 'file:test.db'
  // url: DATABASE_URL,
  // authToken: DATABASE_AUTH_TOKEN
});

export const db = drizzle(client, {
  schema: {
    ...auth,
    ...pembelian,
    ...penjualan,
    ...inventory,
    ...keuangan
  }
});

export const adapter = new DrizzleSQLiteAdapter(db, auth.sessionTable, auth.userTable);
