import { db } from '$lib/server/database';
import {
  pembayaranUtangItemTable,
  pembayaranUtangTable,
  utangTable
} from '$lib/server/database/schema/keuangan';
import { getNumber } from '$lib/server/common';
import { getDashedDate } from '$lib/utils';
import { fail } from '@sveltejs/kit';
import { desc, eq, sql } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { updateJurnalUseCase } from '$lib/server/use-cases/jurnal';

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

    const trx = await getNumber('BYR', pembayaranUtangTable, pembayaranUtangTable.noPembayaran);

    await db.insert(pembayaranUtangTable).values({
      id: id,
      noPembayaran: trx,
      tanggal: getDashedDate(),
      totalNilai: form.data.total
    });

    form.data.utang.forEach(async (i) => {
      await updateJurnalUseCase(i.noFaktur, '2-10001', i.nilai);
      await updateJurnalUseCase(i.noFaktur, '1-10002', -i.nilai);

      await db.insert(pembayaranUtangItemTable).values({
        id: generateIdFromEntropySize(10),
        nilai: i.nilai,
        noPembayaran: id,
        noFaktur: i.noFaktur
      });
      await db
        .update(utangTable)
        .set({
          sisa: sql<number>`${utangTable.sisa} - ${i.nilai}`
        })
        .where(eq(utangTable.noFaktur, i.noFaktur));
    });

    return {
      form
    };
  }
};
