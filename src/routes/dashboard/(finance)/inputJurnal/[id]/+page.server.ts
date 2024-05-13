import { db } from '$lib/server';
import { jurnalTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { eq, like, max, sql } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { currentDate } from '$lib/utils';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  let trx;
  const data = await db.query.jurnalTable.findFirst({
    where: eq(jurnalTable.id, id)
  });

  const akun = await db.query.akunTable.findMany();

  if (!data) {
    const num = await db
      .select({
        num: sql<string>`
        CASE
          WHEN MAX(CAST(SUBSTR(kode_transaksi, -3) AS INTEGER)) ISNULL then '001'
          ELSE SUBSTR('00' || (MAX(CAST(SUBSTR(kode_transaksi, -3) AS INTEGER)) + 1), -3)
        END`
      })
      .from(jurnalTable)
      .where(like(jurnalTable.kodeTransaksi, sql`'TRX-' || strftime('%Y%m%d', 'now') || '-%'`));

    trx = 'TRX-' + currentDate() + '-' + num[0].num;
  } else {
    trx = data.kodeTransaksi;
  }

  return {
    form: await superValidate(data, zod(formSchema)),
    trx,
    akun
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

    if (!form.data.id) {
      form.data.id = generateIdFromEntropySize(10);
    }

    await db
      .insert(jurnalTable)
      .values({
        id: form.data.id,
        kodeTransaksi: form.data.kodeTransaksi,
        deskripsi: form.data.deskripsi,
        nominal: form.data.nominal,
        noReferensi: form.data.noReferensi,
        tanggal: form.data.tanggal,
        akunDebit: form.data.akunDebit,
        akunKredit: form.data.akunKredit
      })
      .onConflictDoUpdate({
        target: jurnalTable.id,
        set: {
          kodeTransaksi: form.data.kodeTransaksi,
          deskripsi: form.data.deskripsi,
          nominal: form.data.nominal,
          noReferensi: form.data.noReferensi,
          tanggal: form.data.tanggal,
          akunDebit: form.data.akunDebit,
          akunKredit: form.data.akunKredit
        }
      });

    return {
      form
    };
  }
};
