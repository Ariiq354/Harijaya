import { db } from '$lib/server';
import {
  pembayaranUtangItemTable,
  pembayaranUtangTable,
  utangTable
} from '$lib/server/schema/keuangan';
import { adjustStok } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';
import { desc, eq, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { generateIdFromEntropySize } from 'lucia';
import { getCurrentDate } from '$lib/utils';

export const load: PageServerLoad = async () => {
  const utangData = await db.query.utangTable.findMany({
    orderBy: desc(utangTable.createdAt),
    with: {
      fakturPembelian: {
        columns: {
          noFaktur: true
        }
      }
    }
  });

  return {
    form: await superValidate(zod(formSchema)),
    utangData
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

    const id = generateIdFromEntropySize(10);

    await db.insert(pembayaranUtangTable).values({
      id: id,
      tanggal: getCurrentDate(),
      totalNilai: form.data.total
    });

    form.data.utang.forEach(async (i) => {
      const idItem = generateIdFromEntropySize(10);
      await db.insert(pembayaranUtangItemTable).values({
        id: idItem,
        nilai: i.nilai,
        noPembayaran: id,
        noUtang: i.utangId
      });
      await db
        .update(utangTable)
        .set({
          sisa: sql<number>`${utangTable.sisa} - ${i.nilai}`
        })
        .where(eq(utangTable.id, i.utangId));
    });

    return {
      form
    };
  }
};
