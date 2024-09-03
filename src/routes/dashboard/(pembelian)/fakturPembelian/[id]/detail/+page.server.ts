import { getFakturPembelianByIdWithBarangUseCase } from '$lib/server/use-cases/pembelian/fakturPembelian';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const faktur = await getFakturPembelianByIdWithBarangUseCase(id);

  if (!faktur) redirect(302, '/dashboard/fakturPembelian');

  return {
    faktur
  };
};
