import { db } from '$lib/server';
import { pembayaranPiutangTable, piutangTable } from '$lib/server/schema/keuangan';
import { redirect } from '@sveltejs/kit';
import { eq, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;

  const data = await db.query.pembayaranPiutangTable.findFirst({
    where: eq(pembayaranPiutangTable.id, id),
    with: {
      piutangItem: {
        columns: {
          noFaktur: true,
          nilai: true
        }
      }
    }
  });

  if (!data) redirect(302, '/dashboard/pembayaranPiutang');
  const piutang = await db.query.piutangTable.findMany({
    where: inArray(
      piutangTable.id,
      data.piutangItem.map((piutang) => piutang.noFaktur!)
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
    piutang
  };
};
