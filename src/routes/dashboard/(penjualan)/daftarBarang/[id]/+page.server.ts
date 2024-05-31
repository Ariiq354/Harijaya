import { db } from '$lib/server';
import { barangTable } from '$lib/server/schema/penjualan';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.barangTable.findFirst({
    where: eq(barangTable.id, id)
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
      .insert(barangTable)
      .values({
        id: form.data.id,
        name: form.data.name,
        deskripsi: form.data.deskripsi,
        harga: form.data.harga,
        satuan: form.data.satuan
      })
      .onConflictDoUpdate({
        target: barangTable.id,
        set: {
          name: form.data.name,
          deskripsi: form.data.deskripsi,
          harga: form.data.harga,
          satuan: form.data.satuan
        }
      });

    return {
      form
    };
  }
};
