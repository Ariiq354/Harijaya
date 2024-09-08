import { getAllAkun } from '$lib/server/data-access/keuangan/akun';
import {
  getAllJurnal,
  getJurnalByDate,
  getTotalJurnalAfterDate,
  getTotalJurnalBeforeDate
} from '$lib/server/data-access/keuangan/jurnal';

export async function getBukuBesarInitUseCase(year: string, month?: string) {
  return await getJurnalByDate(year, month);
}

export async function getBukuBesarByDateUseCase(year: string, month?: string, noAkun?: string) {
  const data = await getJurnalByDate(year, month, noAkun);
  return data;
}

export async function getTotalBukuBesarBeforeInitUseCase(
  year: string,
  month?: string,
  noAkun?: string
) {
  return await getTotalJurnalBeforeDate(year, month, noAkun);
}

export async function getTotalBukuBesarAfterInitUseCase(
  year: string,
  month?: string,
  noAkun?: string
) {
  return await getTotalJurnalAfterDate(year, month, noAkun);
}

export async function getBukuBesarPeriodlyUseCase(period: string, noAkun?: string) {}

export async function getBukuBesarAkunYearlyUseCase(year: string, noAkun?: string) {}

export async function getAllAkunUseCase() {
  return await getAllAkun();
}
