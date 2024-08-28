import { getBarangByTypeAndStatus } from '$lib/server/data-access/penjualan/barang';

export async function getBarangByTypeAndStatusUseCase(type: number, status: number) {
  return await getBarangByTypeAndStatus(type, status);
}
