import { db } from '$lib/server';
import { supplierTable } from '$lib/server/schema/pembelian';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.supplierTable.findFirst({
    where: eq(supplierTable.id, id)
  });

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

    if (!form.data.id) {
      form.data.id = generateIdFromEntropySize(10);
    }

    await db
      .insert(supplierTable)
      .values({
        id: form.data.id,
        name: form.data.name,
        npwp: form.data.npwp,
        phone: form.data.phone,
        address: form.data.address,
        email: form.data.email,
        namaRekening: form.data.namaRekening,
        noRekening: form.data.noRekening,
        namaBank: form.data.namaBank
      })
      .onConflictDoUpdate({
        target: supplierTable.id,
        set: {
          name: form.data.name,
          npwp: form.data.npwp,
          phone: form.data.phone,
          address: form.data.address,
          email: form.data.email,
          namaRekening: form.data.namaRekening,
          noRekening: form.data.noRekening,
          namaBank: form.data.namaBank
        }
      });

    return {
      form
    };
  }
};
