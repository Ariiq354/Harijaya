import { db } from '$lib/server';
import {
  pembayaranUtangItemTable,
  pembayaranUtangTable,
  utangTable
} from '$lib/server/schema/keuangan';
import { fail, redirect } from '@sveltejs/kit';
import { eq, inArray, sql } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;

  const data = await db.query.pembayaranUtangTable.findFirst({
    where: eq(pembayaranUtangTable.id, id),
    with: {
      utangItem: {
        columns: {
          id: true,
          noFaktur: true,
          nilai: true
        }
      }
    }
  });

  if (!data) redirect(302, '/dashboard/pembayaranUtang');
  const utang = await db.query.utangTable.findMany({
    where: inArray(
      utangTable.id,
      data.utangItem.map((utang) => utang.noFaktur!)
    ),
    columns: {
      id: true,
      noFaktur: true,
      sisa: true
    },
    with: {
      fakturPembelian: {
        columns: {
          noFaktur: true
        }
      }
    }
  });

  return {
    form: await superValidate(data, zod(formSchema)),
    utang
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

    await db
      .update(pembayaranUtangTable)
      .set({
        totalNilai: form.data.totalNilai
      })
      .where(eq(pembayaranUtangTable.id, form.data.id));

    form.data.utangItem.forEach(async (v) => {
      await db
        .update(pembayaranUtangItemTable)
        .set({
          nilai: v.nilai
        })
        .where(eq(pembayaranUtangItemTable.id, v.id));
      await db
        .update(utangTable)
        .set({
          sisa: sql<number>`${utangTable.nilai} - ${v.nilai}`
        })
        .where(eq(utangTable.noFaktur, v.noFaktur!));
    });

    return {
      form
    };
  }
};
