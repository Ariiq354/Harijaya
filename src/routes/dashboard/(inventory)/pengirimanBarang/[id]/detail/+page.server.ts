import { db } from '$lib/server';
import { pengirimanTable } from '$lib/server/schema/inventory';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.pengirimanTable.findFirst({
    where: eq(pengirimanTable.id, id),
    with: {
      pemesananPenjualan: {
        columns: {
          noPenjualan: true,
          tanggal: true,
          pelangganId: true
        },
        with: {
          pelanggan: {
            columns: {
              address: true,
              email: true,
              name: true
            }
          },
          produk: {
            with: {
              barang: {
                columns: {
                  name: true,
                  harga: true,
                  satuan: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!data) redirect(302, '/dashboard/pengirimanBarang');

  return {
    data
  };
};
