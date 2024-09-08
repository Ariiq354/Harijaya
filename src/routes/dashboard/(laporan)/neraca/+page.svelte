<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { getDashedDate, tipeAkun } from '$lib/utils';
  import type { PageData } from './$types';

  export let data: PageData;

  let dataJurnal = data.data;

  const stopIndexAktiva = tipeAkun.indexOf('aktiva lainnya');
  const stopIndexPasiva = tipeAkun.indexOf('modal usaha');

  const limitedItems = tipeAkun.slice(0, stopIndexPasiva + 1);

  const aktivaItems = limitedItems.slice(0, stopIndexAktiva + 1);
  const pasivaItems = limitedItems.slice(stopIndexAktiva + 1, stopIndexPasiva + 1);

  const namaAkunAktiva = data.dataAkun
    .filter((item) => aktivaItems.includes(item.kategori))
    .map((item) => item.nama);
  const namaAkunPasiva = data.dataAkun
    .filter((item) => pasivaItems.includes(item.kategori))
    .map((item) => item.nama);

  const filteredDataAktiva = dataJurnal.filter((item) => namaAkunAktiva.includes(item.nama_akun));
  const filteredDataPasiva = dataJurnal.filter((item) => namaAkunPasiva.includes(item.nama_akun));

  const totalAktiva = filteredDataAktiva.reduce((a, item) => (a += item.totalNominal), 0);
  const totalPasiva = filteredDataPasiva.reduce((a, item) => (a += item.totalNominal), 0);

  let monthState = '';
  let yearState = '';
  async function searchDataJurnal(year: string, month: string) {
    // dataJurnal = await getTotalJurnalByDateUseCase(year, month);
  }
</script>

<div class="flex flex-col gap-4">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Neraca</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Neraca</h1>
    </div>
  </div>
  <hr class="border-black" />
  <div class="rounded-lg border-2 bg-white px-12 py-4">
    <div class="mb-12 w-full">
      <div class="border-b-2 p-2 text-center">
        <h1 class="text-2xl font-bold">PT. Harijaya Fillet & Grill</h1>
        <p class="text-xl font-semibold text-black/80">Statement of Financial Position</p>
        <p class="text-black/80">{getDashedDate()}</p>
      </div>
    </div>
    <table class="w-full">
      {#each limitedItems as item, i}
        {@const daftarAkun = data.dataAkun.filter((i) => i.kategori === item)}
        <tr class="border-b-2 odd:bg-gray-100">
          <td colspan="2" class="p-2 font-semibold">
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </td>
        </tr>
        {#each daftarAkun as akun}
          {@const dataTotalAkun = data.data.find((item) => item.nama_akun === akun.nama)}
          <tr class="border-b-2 odd:bg-gray-100">
            <td class="p-2 indent-10">{akun.nama}</td>
            <td>{dataTotalAkun ? dataTotalAkun.totalNominal : 0}</td>
          </tr>
        {/each}
        {#if i === stopIndexAktiva}
          <tr class="border-b-2 text-blue-400 odd:bg-gray-100">
            <td class="p-2 font-semibold"> Total Aktiva </td>
            <td>{totalAktiva}</td>
          </tr>
        {/if}
        {#if i === stopIndexPasiva}
          <tr class="border-b-2 text-blue-400 odd:bg-gray-100">
            <td class="p-2 font-semibold"> Total Pasiva </td>
            <td>{totalPasiva}</td>
          </tr>
        {/if}
      {/each}
    </table>
  </div>
</div>
