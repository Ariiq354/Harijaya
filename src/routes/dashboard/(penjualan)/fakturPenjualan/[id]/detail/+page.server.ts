import { db } from '$lib/server';
import { fakturPenjualanTable } from '$lib/server/schema/penjualan';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.fakturPenjualanTable.findFirst({
    where: eq(fakturPenjualanTable.id, id),
    with: {
      pemesananPenjualan: {
        with: {
          pelanggan: {
            columns: {
              address: true,
              email: true,
              name: true,
              atasNama: true,
              noRekening: true,
              namaBank: true
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

  if (!data) redirect(302, '/dashboard/fakturPenjualan');

  return {
    data
  };
};
