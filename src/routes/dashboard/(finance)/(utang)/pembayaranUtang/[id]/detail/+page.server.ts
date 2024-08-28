import { db } from '$lib/server/database';
import { pembayaranUtangTable, utangTable } from '$lib/server/database/schema/keuangan';
import { redirect } from '@sveltejs/kit';
import { eq, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;

  const data = await db.query.pembayaranUtangTable.findFirst({
    where: eq(pembayaranUtangTable.id, id),
    with: {
      utangItem: {
        columns: {
          noFaktur: true,
          nilai: true
        }
      }
    }
  });

  if (!data) redirect(302, '/dashboard/pembayaranUtang');
  const utang = await db.query.utangTable.findMany({
    where: inArray(
      utangTable.id,
      data.utangItem.map((utang) => utang.noFaktur!)
    ),
    columns: {
      id: true,
      noFaktur: true,
      sisa: true
    },
    with: {
      fakturPembelian: {
        columns: {
          noFaktur: true
        }
      }
    }
  });

  return {
    data,
    utang
  };
};
