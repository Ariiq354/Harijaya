import {
  deleteSupplierUseCase,
  getSupplierUseCase
} from '$lib/server/use-cases/pembelian/supplier';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const pemasokData = await getSupplierUseCase();

  return {
    pemasokData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    await deleteSupplierUseCase(id);

    return;
  }
};
