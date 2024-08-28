import { getCountFakturPembelian } from '$lib/server/data-access/pembelian/fakturPembelian';
import { getCountFakturPenjualan } from '$lib/server/data-access/penjualan/fakturPenjualan';
import { getJumlahUtang } from '$lib/server/data-access/keuangan/utang';
import { getCountBarang } from '$lib/server/data-access/penjualan/barang';
import { getCountSupplier } from '$lib/server/data-access/pembelian/supplier';
import { getJumlahPiutang } from '$lib/server/data-access/keuangan/piutang';

export async function getDashboardData() {
  const jumlahUtang = await getJumlahUtang();
  const jumlahPiutang = await getJumlahPiutang();
  const countFakturPembelian = await getCountFakturPembelian();
  const countFakturPenjualan = await getCountFakturPenjualan();
  const countBarang = await getCountBarang();
  const countSupplier = await getCountSupplier();
  return {
    jumlahUtang,
    jumlahPiutang,
    countFakturPembelian,
    countFakturPenjualan,
    countBarang,
    countSupplier
  };
}
