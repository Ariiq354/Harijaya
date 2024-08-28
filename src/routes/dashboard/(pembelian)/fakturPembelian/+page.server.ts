import {
  deleteFakturPembelianUseCase,
  getAllFakturPembelianUseCase
} from '$lib/server/use-cases/fakturPembelian';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const fakturPembelianData = await getAllFakturPembelianUseCase();

  return {
    fakturPembelianData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    await deleteFakturPembelianUseCase(id);

    return;
  }
};
