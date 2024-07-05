import { db } from '$lib/server';
import {
  pembayaranUtangItemTable,
  pembayaranUtangTable,
  utangTable
} from '$lib/server/schema/keuangan';
import { getNumber } from '$lib/server/utils';
import { getDashedDate } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import { desc, eq, sql } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

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

    const trx = await getNumber('BYR', pembayaranUtangTable, pembayaranUtangTable.noTransaksi);

    await db.insert(pembayaranUtangTable).values({
      id: id,
      noTransaksi: trx,
      tanggal: getDashedDate(),
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
