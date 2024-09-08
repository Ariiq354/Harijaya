import { db } from '$lib/server/database';
import { jurnalTable } from '$lib/server/database/schema/keuangan';
import { fail } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import {
  getAllAkunUseCase,
  getBukuBesarInitUseCase,
  getTotalBukuBesarBeforeInitUseCase,
  getTotalBukuBesarAfterInitUseCase
} from '$lib/server/use-cases/laporan/bukuBesar';
import { getCurrentMonth, getCurrentYear } from '$lib/utils';

export const load: PageServerLoad = async () => {
  const akun = await getAllAkunUseCase();
  const jurnalData = await getBukuBesarInitUseCase(getCurrentYear(), getCurrentMonth());
  const totalAwal = await getTotalBukuBesarBeforeInitUseCase(getCurrentYear(), getCurrentMonth());
  const totalAkhir = await getTotalBukuBesarAfterInitUseCase(getCurrentYear(), getCurrentMonth());

  return {
    jurnalData,
    akun,
    totalAwal,
    totalAkhir
  };
};
