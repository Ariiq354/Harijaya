import { db } from '$lib/server/database';
import {
  pembayaranPiutangItemTable,
  pembayaranPiutangTable,
  piutangTable
} from '$lib/server/database/schema/keuangan';
import { fail, redirect } from '@sveltejs/kit';
import { eq, inArray, sql } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { updateJurnalUseCase } from '$lib/server/use-cases/jurnal';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;

  const data = await db.query.pembayaranPiutangTable.findFirst({
    where: eq(pembayaranPiutangTable.id, id),
    with: {
      piutangItem: {
        columns: {
          id: true,
          noFaktur: true,
          nilai: true
        }
      }
    }
  });

  if (!data) redirect(302, '/dashboard/pembayaranPiutang');
  const piutang = await db.query.piutangTable.findMany({
    where: inArray(
      piutangTable.id,
      data.piutangItem.map((piutang) => piutang.noFaktur!)
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
    piutang
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
      .update(pembayaranPiutangTable)
      .set({
        totalNilai: form.data.totalNilai
      })
      .where(eq(pembayaranPiutangTable.id, form.data.id));

    form.data.piutangItem.forEach(async (v) => {
      await updateJurnalUseCase(v.noFaktur, '1-10002', -v.nilai);
      await updateJurnalUseCase(v.noFaktur, '1-20001', v.nilai);

      await db
        .update(pembayaranPiutangItemTable)
        .set({
          nilai: v.nilai
        })
        .where(eq(pembayaranPiutangItemTable.id, v.id));
      await db
        .update(piutangTable)
        .set({
          sisa: sql<number>`${piutangTable.nilai} - ${v.nilai}`
        })
        .where(eq(piutangTable.noFaktur, v.noFaktur!));
    });

    return {
      form
    };
  }
};
