import { db } from '$lib/server/database';
import { supplierTable } from '$lib/server/database/schema/pembelian';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { getSupplierByIdUseCase, submitDataSupplierUseCase } from '$lib/server/use-cases/supplier';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await getSupplierByIdUseCase(id);

  return {
    form: await superValidate(data, zod(formSchema))
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

    await submitDataSupplierUseCase(form.data);

    return {
      form
    };
  }
};
