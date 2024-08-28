import { lucia } from '$lib/server/auth';
import { loginUseCase } from '$lib/server/use-cases/auth';
import { error, fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    redirect(302, '/dashboard');
  }

  return {
    form: await superValidate(zod(formSchema))
  };
};

export const actions: Actions = {
  login: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    try {
      const res = await loginUseCase(form.data.username, form.data.password);

      const session = await lucia.createSession(res.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes
      });
    } catch (err: any) {
      if (err.message === 'Username atau password salah') {
        return setError(form, 'username', 'Username atau password salah');
      } else {
        error(500, err);
      }
    }

    return {
      form
    };
  },

  logout: async (event) => {
    if (!event.locals.session) {
      return error(401, { message: 'Unauthenticated' });
    }

    await lucia.invalidateSession(event.locals.session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });

    redirect(302, '/');
  }
};
