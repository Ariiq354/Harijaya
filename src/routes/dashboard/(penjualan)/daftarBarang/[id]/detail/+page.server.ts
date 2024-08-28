import { db } from '$lib/server/database';
import { barangTable } from '$lib/server/database/schema/penjualan';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.barangTable.findFirst({
    where: eq(barangTable.id, id),
    with: {
      barangHarga: true
    }
  });

  if (!data) redirect(302, '/dashboard/daftarBarang');

  return {
    data
  };
};
