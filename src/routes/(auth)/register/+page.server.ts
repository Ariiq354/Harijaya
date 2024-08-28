import { registerUseCase } from '$lib/server/use-cases/auth';
import { error, fail } from '@sveltejs/kit';
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

    try {
      await registerUseCase(form.data.username, form.data.password);
    } catch (err: any) {
      if (err.message === 'Username sudah ada') {
        return setError(form, 'username', 'Username sudah ada');
      } else {
        error(500, err);
      }
    }

    return {
      form
    };
  }
};
