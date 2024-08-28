import { getDashedDate } from '$lib/utils';
import { generateIdFromEntropySize } from 'lucia';
import {
  getJurnalByKode,
  createJurnal,
  updateJurnalById
} from '$lib/server/data-access/keuangan/jurnal';

export async function updateJurnalUseCase(
  kodeTransaksi: string | null,
  kodeAkun: string | null,
  nominal: number
) {
  if (kodeTransaksi && kodeAkun) {
    const exist = await getJurnalByKode(kodeTransaksi);

    const data = {
      id: generateIdFromEntropySize(10),
      tanggal: getDashedDate(),
      deskripsi: '',
      noReferensi: '',
      kodeTransaksi,
      noAkun: kodeAkun,
      nominal
    };

    if (exist) {
      if (exist.noAkun === kodeAkun) {
        await updateJurnalById({ nominal }, exist.id);
      } else {
        await createJurnal(data);
      }
    } else {
      await createJurnal(data);
    }
  }
}
