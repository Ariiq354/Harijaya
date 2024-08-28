import { db } from '$lib/server/database';
import { fakturPembelianTable } from '$lib/server/database/schema/pembelian';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.prosesTable.findFirst({
    where: eq(fakturPembelianTable.id, id),
    with: {
      produkProses: {
        with: {
          barang: true
        }
      }
    }
  });

  if (!data) redirect(302, '/dashboard/prosesProduksi');

  return {
    data
  };
};
