import { db } from '$lib/server';
import { fakturPembelianTable } from '$lib/server/schema/pembelian';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.fakturPembelianTable.findFirst({
    where: eq(fakturPembelianTable.id, id),
    with: {
      supplier: true,
      produk: {
        with: {
          barang: true
        }
      }
    }
  });

  if (!data) redirect(302, '/dashboard/fakturPembelian');

  return {
    data
  };
};
