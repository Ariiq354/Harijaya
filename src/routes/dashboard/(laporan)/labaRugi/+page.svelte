<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { getDashedDate, tipeAkun } from '$lib/utils';
  import type { PageData } from './$types';

  export let data: PageData;

  let startIndex = tipeAkun.findIndex((item) => item === 'pendapatan usaha');
  let limitedItems = tipeAkun.slice(startIndex, tipeAkun.length - 1);
  let stopIndexPendapatan = limitedItems.findIndex((item) => item === 'pendapatan lainnya');
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
      {#each limitedItems as item, i}
        {@const daftarAkun = data.data.filter((i) => i.kategori === item)}
        <tr class="border-b-2 odd:bg-gray-100">
          <td colspan="2" class="p-2 font-semibold">
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </td>
        </tr>
        {#each daftarAkun as akun}
          <tr class="border-b-2 odd:bg-gray-100">
            <td class="p-2 indent-10">{akun.nama}</td>
            <td>0</td>
          </tr>
        {/each}
        {#if i === stopIndexPendapatan}
          <tr class="border-b-2 odd:bg-gray-100">
            <td class="p-2 font-semibold text-blue-400"> Total Pendapatan </td>
            <td>0</td>
          </tr>
        {/if}
        {#if i === limitedItems.length - 1}
          <tr class="border-b-2 odd:bg-gray-100">
            <td class="p-2 font-semibold text-blue-400"> Total Biaya </td>
            <td>0</td>
          </tr>
        {/if}
      {/each}
    </table>
  </div>
</div>
