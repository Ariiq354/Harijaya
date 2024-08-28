import { getDashboardData } from '$lib/server/use-cases/dashboard';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const data = await getDashboardData();

  return data;
};
