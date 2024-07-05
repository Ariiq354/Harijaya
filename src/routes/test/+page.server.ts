import { db } from '$lib/server';
import { jurnalTable } from '$lib/server/schema/keuangan';
import { getNumber } from '$lib/server/utils';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  let trx;
  const data = await db.query.jurnalTable.findFirst({});

  const akun = await db.query.akunTable.findMany();

  if (!data) {
    trx = await getNumber('TRX', jurnalTable, jurnalTable.kodeTransaksi);
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
