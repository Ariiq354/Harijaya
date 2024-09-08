import { getAllAkunUseCase } from '$lib/server/use-cases/keuangan/akun';
import { getInitNeracaUseCase } from '$lib/server/use-cases/laporan/neraca';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const data = await getInitNeracaUseCase();
  const dataAkun = await getAllAkunUseCase();

  return {
    data,
    dataAkun
  };
};
