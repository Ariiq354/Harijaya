import { db } from '$lib/server/database';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const data = await db.query.akunTable.findMany();

  return {
    data
  };
};
