import { db } from '$lib/server';
import { pelangganTable } from '$lib/server/schema/penjualan';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.pelangganTable.findFirst({
    where: eq(pelangganTable.id, id)
  });

  if (!data) redirect(302, '/dashboard/daftarPelanggan');

  return {
    data
  };
};
