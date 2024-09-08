import {
  getJurnalByDate,
  getJurnalByPeriod,
  getTotalJurnalByDate
} from '$lib/server/data-access/keuangan/jurnal';

export async function getTotalJurnalByDateUseCase(year: string, month?: string) {
  const data = await getTotalJurnalByDate(year, month);
  return data;
}

export async function getJurnalByDateUseCase(year: string, month?: string) {
  const data = await getJurnalByDate(year, month);
  return data;
}

export async function getJurnalByPeriodUseCase(start: string, end: string) {
  const data = await getJurnalByPeriod(start, end);
  return data;
}
