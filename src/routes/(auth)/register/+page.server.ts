import { db } from '$lib/server';
import { userTable } from '$lib/server/schema/auth';
import { fail } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';
import { hash } from '@node-rs/argon2';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(formSchema))
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

    const exist = await db.query.userTable.findFirst({
      where: (users, { eq }) => eq(users.username, form.data.username)
    });

    if (exist) {
      return setError(form, 'username', 'Username already exist');
    }

    const userId = generateIdFromEntropySize(10);
    const passwordHash = await hash(form.data.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });

    await db.insert(userTable).values({
      id: userId,
      username: form.data.username,
      password: passwordHash
    });

    return {
      form
    };
  }
};
