import { db } from '$lib/server';
import { penerimaanTable } from '$lib/server/schema/inventory';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.penerimaanTable.findFirst({
    where: eq(penerimaanTable.id, id),
    with: {
      pemesananPembelian: {
        columns: {
          noPembelian: true,
          tanggal: true,
          supplierId: true
        },
        with: {
          supplier: {
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

  if (!data) redirect(302, '/dashboard/penerimaanBarang');

  return {
    data
  };
};
