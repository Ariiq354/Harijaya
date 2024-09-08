import {
  getJurnalByDateUseCase,
  getJurnalByPeriodUseCase
} from '$lib/server/use-cases/keuangan/jurnal';
import { json } from '@sveltejs/kit';

type tableJurnalType = {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  tanggal: string;
  deskripsi: string;
  kode_transaksi: string;
  no_referensi: string;
  nominal: number;
  no_akun: string | null;
};

export async function POST({ request }) {
  const { year, month, period } = await request.json();

  let result: tableJurnalType[] = [];
  if (period) {
    result = await getJurnalByPeriodUseCase(period[0], period[1]);
  } else {
    result = await getJurnalByDateUseCase(year, month);
  }

  return json(result);
}
