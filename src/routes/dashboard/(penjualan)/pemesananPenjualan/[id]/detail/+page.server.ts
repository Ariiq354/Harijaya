import { db } from '$lib/server';
import { pemesananPenjualanTable } from '$lib/server/schema/penjualan';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.pemesananPenjualanTable.findFirst({
    where: eq(pemesananPenjualanTable.id, id),
    with: {
      pelanggan: true,
      produk: {
        with: {
          barang: true
        }
      }
    }
  });

  if (!data) redirect(302, '/dashboard/pemesananPenjualan');

  return {
    data
  };
};
