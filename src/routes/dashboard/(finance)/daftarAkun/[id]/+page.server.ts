import { db } from '$lib/server';
import { akunTable } from '$lib/server/schema/keuangan';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.akunTable.findFirst({
    where: eq(akunTable.id, id)
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
      .insert(akunTable)
      .values({
        id: form.data.id,
        kode: form.data.kode,
        nama: form.data.nama,
        deskripsi: form.data.deskripsi,
        kategori: form.data.kategori
      })
      .onConflictDoUpdate({
        target: akunTable.id,
        set: {
          kode: form.data.kode,
          nama: form.data.nama,
          deskripsi: form.data.deskripsi,
          kategori: form.data.kategori
        }
      });

    return {
      form
    };
  }
};
