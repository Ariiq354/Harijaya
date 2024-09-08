import {
  getTotalJurnalBeforeDate,
  getTotalJurnalAfterDate
} from '$lib/server/data-access/keuangan/jurnal';
import { getBukuBesarByDateUseCase } from '$lib/server/use-cases/laporan/bukuBesar';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  const { year, month, noAkun } = await request.json();

  // Fetch data from all three sources
  const [beforeData, afterData, bukuBesarData] = await Promise.all([
    getTotalJurnalBeforeDate(year, month, noAkun),
    getTotalJurnalAfterDate(year, month, noAkun),
    getBukuBesarByDateUseCase(year, month, noAkun)
  ]);

  // Combine all results into one object
  const combinedData = {
    before: beforeData,
    after: afterData,
    bukuBesar: bukuBesarData
  };

  return json(combinedData);
}
