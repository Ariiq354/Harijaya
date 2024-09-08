import { getAllAkun } from '$lib/server/data-access/keuangan/akun';
import { getAllJurnal, getJurnalByDate } from '$lib/server/data-access/keuangan/jurnal';

export async function getBukuBesarInitUseCase() {
  return await getJurnalByDate('2024');
}

export async function getBukuBesarAkunMonthlyUseCase(
  year: string,
  month: string,
  noAkun?: string
) {}

export async function getBukuBesarPeriodlyUseCase(period: string, noAkun?: string) {}

export async function getBukuBesarAkunYearlyUseCase(year: string, noAkun?: string) {}

export async function getAllAkunUseCase() {
  return await getAllAkun();
}
