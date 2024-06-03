import { db } from '$lib/server';
import { supplierTable } from '$lib/server/schema/pembelian';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.supplierTable.findFirst({
    where: eq(supplierTable.id, id)
  });

  if (!data) redirect(302, '/dashboard/daftarPemasok');

  return {
    data
  };
};
