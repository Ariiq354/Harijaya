import { getAllAkun } from '$lib/server/data-access/keuangan/akun';
import { getAllJurnal } from '$lib/server/data-access/keuangan/jurnal';

export async function getBukuBesarAllUseCase() {
  return await getAllJurnal();
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
