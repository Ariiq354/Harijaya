import { db } from '$lib/server/database';
import { jurnalTable } from '$lib/server/database/schema/keuangan';
import { getNumber } from '$lib/server/common';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { generateIdFromEntropySize } from 'lucia';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  let trx;
  const data = await db.query.jurnalTable.findFirst({
    where: eq(jurnalTable.id, id),
    with: {
      akun: true
    }
  });

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
        noAkun: form.data.noAkun
      })
      .onConflictDoUpdate({
        target: jurnalTable.id,
        set: {
          kodeTransaksi: form.data.kodeTransaksi,
          deskripsi: form.data.deskripsi,
          nominal: form.data.nominal,
          noReferensi: form.data.noReferensi,
          tanggal: form.data.tanggal,
          noAkun: form.data.noAkun
        }
      });

    return {
      form
    };
  }
};
