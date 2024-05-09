import { db } from '$lib/server';
import { lucia } from '$lib/server/auth';
import { error, fail, redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) redirect(302, '/dashboard');

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

    const exist = await db.query.userTable.findFirst({
      where: (users, { eq }) => eq(users.username, form.data.username)
    });

    if (!exist) {
      error(401, 'Username atau password salah');
    }

    const validPassword = await new Argon2id().verify(exist.password!, form.data.password);

    if (!validPassword) {
      error(401, 'Username atau password salah');
    }

    const session = await lucia.createSession(exist.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });

    return {
      form
    };
  },

  logout: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }

    await lucia.invalidateSession(event.locals.session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });

    redirect(302, '/login');
  }
};
