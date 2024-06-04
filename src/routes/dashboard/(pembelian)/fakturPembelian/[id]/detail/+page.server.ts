import { db } from '$lib/server';
import { fakturPembelianTable, pemesananPembelianTable } from '$lib/server/schema/pembelian';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.fakturPembelianTable.findFirst({
    where: eq(fakturPembelianTable.id, id),
    with: {
      pemesananPembelian: {
        with: {
          supplier: {
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

  if (!data) redirect(302, '/dashboard/fakturPembelian');

  return {
    data
  };
};
