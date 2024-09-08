import { getAllAkunUseCase } from '$lib/server/use-cases/keuangan/akun';
import { getTotalJurnalByDateUseCase } from '$lib/server/use-cases/keuangan/jurnal';
import { getCurrentMonth } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const data = await getTotalJurnalByDateUseCase('2024', getCurrentMonth());
  const dataAkun = await getAllAkunUseCase();

  return {
    data,
    dataAkun
  };
};
