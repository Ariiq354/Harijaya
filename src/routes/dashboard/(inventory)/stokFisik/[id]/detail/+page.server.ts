import { db } from '$lib/server';
import { stokFisikTable } from '$lib/server/schema/inventory';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.stokFisikTable.findFirst({
    where: eq(stokFisikTable.id, id),
    with: {
      produkStok: {
        with: {
          barang: true
        }
      }
    }
  });

  if (!data) redirect(302, '/dashboard/stokFisik');

  return {
    data
  };
};
