import { getSupplierByIdUseCase } from '$lib/server/use-cases/pembelian/supplier';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await getSupplierByIdUseCase(id);

  if (!data) redirect(302, '/dashboard/daftarPemasok');

  return {
    data
  };
};
