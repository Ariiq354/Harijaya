import { db } from '$lib/server';
import { akunTable } from '$lib/server/schema';
import { generateIdFromEntropySize } from 'lucia';

function akunSeed() {
  [1, 2, 3].forEach(async (i) => {
    await db.insert(akunTable).values({
      id: generateIdFromEntropySize(10),
      kode: 'kode akun ' + i,
      nama: 'akun ' + i,
      kategori: 'Aktiva tetap',
      deskripsi: 'deskripsi akun ' + i
    });
  });
}

akunSeed();
