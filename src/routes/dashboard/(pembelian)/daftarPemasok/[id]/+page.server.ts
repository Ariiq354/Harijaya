import { db } from '$lib/server';
import { pemasokTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.pemasokTable.findFirst({
    where: eq(pemasokTable.id, id)
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
      .insert(pemasokTable)
      .values({
        id: form.data.id,
        name: form.data.name,
        npwp: form.data.npwp,
        phone: form.data.phone,
        address: form.data.address,
        email: form.data.email
      })
      .onConflictDoUpdate({
        target: pemasokTable.id,
        set: {
          name: form.data.name,
          npwp: form.data.npwp,
          phone: form.data.phone,
          address: form.data.address,
          email: form.data.email
        }
      });

    return {
      form
    };
  }
};
