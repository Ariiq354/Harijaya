import { db } from '$lib/server';
import { jurnalTable } from '$lib/server/schema/keuangan';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.jurnalTable.findFirst({
    where: eq(jurnalTable.id, id)
  });

  const akun = await db.query.akunTable.findMany();

  if (!data) redirect(302, '/dashboard/inputJurnal');

  return {
    data,
    akun
  };
};
