import { getJurnalByDateUseCase } from '$lib/server/use-cases/keuangan/jurnal';
import { getCurrentMonth } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const data = await getJurnalByDateUseCase('2024', getCurrentMonth());

  return {
    data
  };
};
