import { db } from '$lib/server';
import { stokBarangJadiTable, stokBahanMentahTable } from '$lib/server/schema/inventory';
import { barangTable } from '$lib/server/schema/penjualan';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateIdFromEntropySize } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.barangTable.findFirst({
    where: eq(barangTable.id, id)
  });

  return {
    form: await superValidate(data, zod(formSchema))
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
      .insert(barangTable)
      .values({
        id: form.data.id,
        tipe: form.data.tipe,
        name: form.data.name,
        deskripsi: form.data.deskripsi,
        satuan: form.data.satuan
      })
      .onConflictDoUpdate({
        target: barangTable.id,
        set: {
          name: form.data.name,
          tipe: form.data.tipe,
          deskripsi: form.data.deskripsi,
          satuan: form.data.satuan
        }
      });

    if (form.data.tipe !== 2) {
      let id = '';
      const data = await db.query.stokBahanMentahTable.findFirst({
        where: eq(stokBahanMentahTable.barangId, form.data.id)
      });
      if (!data) {
        id = generateIdFromEntropySize(10);
        await db.delete(stokBarangJadiTable).where(eq(stokBarangJadiTable.barangId, form.data.id));
      } else {
        id = data.id;
      }
      await db
        .insert(stokBahanMentahTable)
        .values({
          id: id,
          stok: 0,
          barangId: form.data.id
        })
        .onConflictDoNothing({
          target: stokBahanMentahTable.id
        });
    } else {
      let id = '';
      const data = await db.query.stokBarangJadiTable.findFirst({
        where: eq(stokBarangJadiTable.barangId, form.data.id)
      });
      if (!data) {
        id = generateIdFromEntropySize(10);
        await db
          .delete(stokBahanMentahTable)
          .where(eq(stokBahanMentahTable.barangId, form.data.id));
      } else {
        id = data.id;
      }
      await db
        .insert(stokBarangJadiTable)
        .values({
          id: id,
          stok: 0,
          barangId: form.data.id
        })
        .onConflictDoNothing({
          target: stokBarangJadiTable.id
        });
    }

    return {
      form
    };
  }
};
