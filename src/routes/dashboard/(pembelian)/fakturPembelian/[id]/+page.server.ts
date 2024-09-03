import { getBarangByTypeAndStatusUseCase } from '$lib/server/use-cases/barang';
import {
  dataSubmitFakturPembelian,
  getFakturPembelianByIdUseCase
} from '$lib/server/use-cases/pembelian/fakturPembelian';
import { getSupplierUseCase } from '$lib/server/use-cases/pembelian/supplier';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const supplier = await getSupplierUseCase();
  const barang = await getBarangByTypeAndStatusUseCase(1, 2);
  const data = await getFakturPembelianByIdUseCase(id);

  return {
    form: await superValidate(data, zod(formSchema)),
    supplier,
    barang
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    await dataSubmitFakturPembelian(form.data, event.locals.user!.id);

    return {
      form
    };
  }
};
