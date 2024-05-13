import { fail, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { testTags } from '$lib/stores';
import { get } from 'svelte/store';

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(formSchema));
  return { form };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    console.log(form.data);

    return {
      form
    };
  }
};
