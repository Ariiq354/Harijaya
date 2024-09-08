import { getTotalJurnalByDate } from '$lib/server/data-access/keuangan/jurnal';

export async function getTotalJurnalByDateUseCase(year: string, month?: string) {
  const data = await getTotalJurnalByDate(year, month);
  return data;
}
