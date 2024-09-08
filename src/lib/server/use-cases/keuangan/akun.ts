import { getAllAkun } from '$lib/server/data-access/keuangan/akun';

export async function getAllAkunUseCase() {
  return await getAllAkun();
}
