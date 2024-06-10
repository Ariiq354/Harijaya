import { db } from '$lib/server';
import { fakturPenjualanTable } from '$lib/server/schema/penjualan';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.fakturPenjualanTable.findFirst({
    where: eq(fakturPenjualanTable.id, id),
    with: {
      pelanggan: true,
      produk: {
        with: {
          barang: true
        }
      }
    }
  });

  if (!data) redirect(302, '/dashboard/fakturPenjualan');

  return {
    data
  };
};
