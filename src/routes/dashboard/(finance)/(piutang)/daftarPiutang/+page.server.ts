import { db } from '$lib/server/database';
import {
  pembayaranPiutangItemTable,
  pembayaranPiutangTable,
  piutangTable
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
  const piutangData = await db.query.piutangTable.findMany({
    orderBy: desc(piutangTable.createdAt),
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
    piutangData
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

    const trx = await getNumber('BYR', pembayaranPiutangTable, pembayaranPiutangTable.noPembayaran);

    await db.insert(pembayaranPiutangTable).values({
      id: id,
      noPembayaran: trx,
      tanggal: getDashedDate(),
      totalNilai: form.data.total
    });

    form.data.piutang.forEach(async (i) => {
      await updateJurnalUseCase(i.noFaktur, '1-10002', i.nilai);
      await updateJurnalUseCase(i.noFaktur, '1-20001', -i.nilai);

      await db.insert(pembayaranPiutangItemTable).values({
        id: generateIdFromEntropySize(10),
        nilai: i.nilai,
        noPembayaran: id,
        noFaktur: i.noFaktur
      });
      await db
        .update(piutangTable)
        .set({
          sisa: sql<number>`${piutangTable.sisa} - ${i.nilai}`
        })
        .where(eq(piutangTable.noFaktur, i.noFaktur));
    });

    return {
      form
    };
  }
};
