import { getTotalJurnalByDateUseCase } from '$lib/server/use-cases/keuangan/jurnal';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  const { year, month } = await request.json();

  const data = await getTotalJurnalByDateUseCase(year, month);

  return json(data);
}
