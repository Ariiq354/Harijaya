import { db } from '$lib/server';
import { piutangTable, utangTable } from '$lib/server/schema/keuangan';
import { count, sql, sum } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { fakturPembelianTable, supplierTable } from '$lib/server/schema/pembelian';
import { barangTable, fakturPenjualanTable } from '$lib/server/schema/penjualan';

export const load: PageServerLoad = async () => {
  const utang = await db
    .select({
      jumlah: sql<number>`coalesce(sum(${utangTable.nilai}), 0)`
    })
    .from(utangTable);

  const fakturPembelian = await db
    .select({
      jumlah: sql<number>`coalesce(count(${fakturPembelianTable.id}), 0)`
    })
    .from(fakturPembelianTable);

  const piutang = await db
    .select({
      jumlah: sql<number>`coalesce(sum(${piutangTable.nilai}), 0)`
    })
    .from(piutangTable);

  const fakturPenjualan = await db
    .select({
      jumlah: sql<number>`coalesce(count(${fakturPenjualanTable.id}), 0)`
    })
    .from(fakturPenjualanTable);

  const barang = await db
    .select({
      jumlah: sql<number>`coalesce(count(${barangTable.id}), 0)`
    })
    .from(barangTable);

  const supplier = await db
    .select({
      jumlah: count(supplierTable.id)
    })
    .from(supplierTable);

  return {
    utang,
    fakturPembelian,
    fakturPenjualan,
    piutang,
    barang,
    supplier
  };
};
