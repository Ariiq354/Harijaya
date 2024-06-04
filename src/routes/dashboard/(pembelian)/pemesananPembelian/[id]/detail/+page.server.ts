import { db } from '$lib/server';
import { pemesananPembelianTable } from '$lib/server/schema/pembelian';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.pemesananPembelianTable.findFirst({
    where: eq(pemesananPembelianTable.id, id),
    with: {
      supplier: true,
      produk: {
        with: {
          barang: true
        }
      }
    }
  });

  if (!data) redirect(302, '/dashboard/pemesananPembelian');

  return {
    data
  };
};
