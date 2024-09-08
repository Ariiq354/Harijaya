import { getTotalJurnalByDate } from '$lib/server/data-access/keuangan/jurnal';

export async function getInitNeracaUseCase() {
  const data = await getTotalJurnalByDate('2024');
  return data;
}
