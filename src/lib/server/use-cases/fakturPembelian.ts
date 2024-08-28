import {
  deleteFakturPembelianById,
  getAllFakturPembelian,
  getFakturPembelianById,
  getFakturPembelianByIdWithBarang,
  getFakturPembelianByNoFaktur,
  createFakturPembelian
} from '$lib/server/data-access/pembelian/fakturPembelian';
import { error } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';
import { deleteJurnalByKode } from '$lib/server/data-access/keuangan/jurnal';
import { deleteUtangByFaktur, createUtang } from '$lib/server/data-access/keuangan/utang';
import { updateJurnalUseCase } from './jurnal';
import { updateStokUseCase } from './stok';
import { db } from '$lib/server/database';
import { pembelianProdukTable } from '$lib/server/database/schema/pembelian';
import { utangTable } from '$lib/server/database/schema/keuangan';
import { eq } from 'drizzle-orm';

type FakturPembelianData = {
  id: string;
  supplierId: string | null;
  noFaktur: string;
  tanggal: string;
  lampiran: string;
  catatan: string;
  ppn: boolean;
  biayaKirim: number;
  biayaLainnya: number;
  produk: {
    id: string;
    barangId: string;
    kuantitas: number;
    harga: number;
  }[];
};

export async function getAllFakturPembelianUseCase() {
  return await getAllFakturPembelian();
}

export async function getFakturPembelianByIdUseCase(id: string) {
  return await getFakturPembelianById(id);
}

export async function getFakturPembelianByIdWithBarangUseCase(id: string) {
  return await getFakturPembelianByIdWithBarang(id);
}

export async function deleteFakturPembelianUseCase(id: string) {
  const data = await getFakturPembelianById(id);

  if (!data) return error(409, 'Faktur pembelian not exist');

  data.produk.forEach(async (i) => {
    await updateStokUseCase(i.barangId, -i.kuantitas, i.harga);
  });
  await deleteFakturPembelianById(data.id);
  await deleteUtangByFaktur(data.noFaktur);
  await deleteJurnalByKode(data.noFaktur);
}

export async function dataSubmitFakturPembelian(data: FakturPembelianData, userId: string) {
  const exist = await getFakturPembelianByNoFaktur(data.noFaktur);

  if (exist) {
    return error(400, 'No Faktur Sudah ada');
  }

  const subTotal = data.produk.reduce(
    (acc, item) => acc + Number(item.harga) * Number(item.kuantitas),
    0
  );
  const total = subTotal + Number(data.biayaKirim) + Number(data.biayaLainnya);

  await updateJurnalUseCase(data.noFaktur, '1-30001', subTotal);
  await updateJurnalUseCase(data.noFaktur, '5-10013', data.biayaKirim);
  await updateJurnalUseCase(data.noFaktur, '5-20009', data.biayaLainnya);
  await updateJurnalUseCase(data.noFaktur, '2-10001', -total);

  if (!data.id) {
    const inputData = {
      id: generateIdFromEntropySize(10),
      biayaKirim: data.biayaKirim,
      biayaLainnya: data.biayaLainnya,
      catatan: data.catatan,
      supplierId: data.supplierId,
      noFaktur: data.noFaktur,
      tanggal: data.tanggal,
      userId: userId,
      lampiran: data.lampiran,
      total: total
    };

    const inputUtang = {
      id: generateIdFromEntropySize(10),
      nilai: total,
      noFaktur: data.noFaktur,
      sisa: total
    };

    //Add products
    await createFakturPembelian(inputData);

    await createUtang(inputUtang);

    for (const item of data.produk) {
      await updateStokUseCase(item.barangId, item.kuantitas, item.harga);

      await db.insert(pembelianProdukTable).values({
        id: generateIdFromEntropySize(10),
        noPembelian: data.noFaktur,
        harga: item.harga,
        barangId: item.barangId,
        kuantitas: item.kuantitas
      });
    }
  } else {
    // Update

    await db
      .update(utangTable)
      .set({
        nilai: total
      })
      .where(eq(utangTable.noFaktur, data.id));

    const originalProducts = await db.query.pembelianProdukTable.findMany({
      where: eq(pembelianProdukTable.noPembelian, data.noFaktur)
    });

    const deletedProducts = originalProducts.filter(
      (op) => !data.produk.some((up) => up.id === op.id)
    );
    deletedProducts.forEach(async (v) => {
      await updateStokUseCase(v.barangId, -v.kuantitas, v.harga);
      await db.delete(pembelianProdukTable).where(eq(pembelianProdukTable.id, v.id));
    });

    const updatedProducts = data.produk.filter((up) =>
      originalProducts.some((op) => op.id === up.id)
    );
    updatedProducts.forEach(async (v) => {
      const originalProduct = originalProducts.find((op) => op.id === v.id);

      await updateStokUseCase(
        originalProduct!.barangId,
        -originalProduct!.kuantitas,
        originalProduct!.harga
      );
      await updateStokUseCase(v.barangId, v.kuantitas, v.harga);

      await db
        .update(pembelianProdukTable)
        .set({
          harga: v.harga,
          barangId: v.barangId,
          kuantitas: v.kuantitas
        })
        .where(eq(pembelianProdukTable.id, v.id));
    });

    const addedProducts = data.produk.filter(
      (up) => !originalProducts.some((op) => op.id === up.id)
    );
    addedProducts.forEach(async (v) => {
      await updateStokUseCase(v.barangId, v.kuantitas, v.harga);
      await db.insert(pembelianProdukTable).values({
        id: generateIdFromEntropySize(10),
        kuantitas: v.kuantitas,
        noPembelian: data.noFaktur,
        harga: v.harga,
        barangId: v.barangId
      });
    });
  }
}
