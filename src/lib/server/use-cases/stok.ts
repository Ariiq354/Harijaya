import { generateIdFromEntropySize } from 'lucia';
import {
  getBarangHargaById,
  createBarangHargaStok,
  updateBarangHargaStok,
  getStok
} from '$lib/server/data-access/penjualan/barangHarga';
import { error } from '@sveltejs/kit';
import { message } from 'sveltekit-superforms';

export async function updateStokUseCase(barangId: string, kuantitas: number, harga: number) {
  const exist = await getBarangHargaById(barangId);

  const id = generateIdFromEntropySize(10);
  if (exist) {
    if (exist.harga === harga) {
      await updateBarangHargaStok(exist.id, kuantitas);
    } else {
      await createBarangHargaStok(kuantitas, id, harga, barangId);
    }
  } else {
    await createBarangHargaStok(kuantitas, id, harga, barangId);
  }
}

export async function checkStok(barangId: string, harga: number, kuantitas: number) {
  const barang = await getStok(barangId, harga);

  if (barang) {
    if (kuantitas > barang.stok) {
      return {
        message: 'Stok tidak cukup'
      };
    }
  }
  return {
    message: 'success'
  };
}
