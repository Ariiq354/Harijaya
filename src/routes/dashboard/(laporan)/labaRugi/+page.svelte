<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Plus } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { getDashedDate, tipeAkun } from '$lib/utils';
</script>

<div class="flex flex-col gap-4">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Laba / Rugi</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Laba / Rugi</h1>
    </div>
  </div>
  <hr class="border-black" />
  <div class="rounded-lg border-2 bg-white px-12 py-4">
    <div class="mb-12 w-full">
      <div class="border-b-2 p-2 text-center">
        <h1 class="text-2xl font-bold">PT. Harijaya Fillet & Grill</h1>
        <p class="text-xl font-semibold text-black/80">Laporan Laba & Rugi</p>
        <p class="text-black/80">{getDashedDate()}</p>
      </div>
    </div>
    <table class="w-full">
      <tr class="border-b-2 odd:bg-gray-100">
        <td colspan="3" class="p-2 font-semibold"> Pendapatan </td>
      </tr>
      <tr class="border-b-2 odd:bg-gray-100">
        <td class="p-2 indent-10"> Pendapatan Jasa </td>
        <td class="text-right">1000000</td>
        <td></td>
      </tr>
      <tr class="border-b-2 odd:bg-gray-100">
        <td class="p-2 indent-10"> Pendapatan Penjualan Barang </td>
        <td class="text-right">1000000</td>
        <td></td>
      </tr>
      <tr class="border-b-2 odd:bg-gray-100">
        <td class="p-2 indent-10"> Pendapatan Penjualan Per Barang </td>
        <td class="text-right">1000000</td>
        <td></td>
      </tr>
      <tr class="border-b-2 odd:bg-gray-100">
        <td class="p-2 indent-10"> Retur Penjualan </td>
        <td class="text-right">-</td>
        <td></td>
      </tr>
      <tr class="border-b-2 odd:bg-gray-100">
        <td class="p-2 indent-10"> Potongan Penjualan </td>
        <td class="text-right">-</td>
        <td></td>
      </tr>
      <tr class="border-b-2 odd:bg-gray-100">
        <td class="p-2 text-blue-500"> Total Pendapatan </td>
        <td></td>
        <td class="p-2 text-right">9182739</td>
      </tr>
      <tr class="border-b-2 odd:bg-gray-100">
        <td colspan="3" class="p-2 font-semibold"> Harga Pokok Penjualan </td>
      </tr>
    </table>
  </div>
</div>
