import { db } from '$lib/server';
import {
  pembayaranPiutangItemTable,
  pembayaranPiutangTable,
  piutangTable
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

    const trx = await getNumber('BYR', pembayaranPiutangTable, pembayaranPiutangTable.noTransaksi);

    await db.insert(pembayaranPiutangTable).values({
      id: id,
      noTransaksi: trx,
      tanggal: getDashedDate(),
      totalNilai: form.data.total
    });

    form.data.piutang.forEach(async (i) => {
      const idItem = generateIdFromEntropySize(10);
      await db.insert(pembayaranPiutangItemTable).values({
        id: idItem,
        nilai: i.nilai,
        noPembayaran: id,
        noPiutang: i.piutangId
      });
      await db
        .update(piutangTable)
        .set({
          sisa: sql<number>`${piutangTable.sisa} - ${i.nilai}`
        })
        .where(eq(piutangTable.id, i.piutangId));
    });

    return {
      form
    };
  }
};
