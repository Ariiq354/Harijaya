<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Select from '$lib/components/ui/select';
  import {
    getCurrentMonth,
    getCurrentMonthName,
    getCurrentYear,
    getDashedDate,
    getYears,
    tipeAkun
  } from '$lib/utils';
  import { toast } from 'svelte-sonner';
  import type { PageData } from './$types';

  export let data: PageData;

  let dataJurnal = data.data;

  const startIndex = tipeAkun.indexOf('pendapatan usaha');

  let limitedItems = tipeAkun.slice(startIndex, tipeAkun.length);
  const stopIndexPendapatan = limitedItems.indexOf('pendapatan lainnya');

  const pendapatanItems = limitedItems.slice(0, stopIndexPendapatan + 1);
  const biayaItems = limitedItems.slice(stopIndexPendapatan + 1, limitedItems.length);

  const namaAkunPendapatan = data.dataAkun
    .filter((item) => pendapatanItems.includes(item.kategori))
    .map((item) => item.nama);
  const namaAkunBiaya = data.dataAkun
    .filter((item) => biayaItems.includes(item.kategori))
    .map((item) => item.nama);

  $: filteredDataPendapatan = dataJurnal.filter((item) =>
    namaAkunPendapatan.includes(item.nama_akun)
  );
  $: filteredDataBiaya = dataJurnal.filter((item) => namaAkunBiaya.includes(item.nama_akun));

  $: totalPendapatan = filteredDataPendapatan.reduce((a, item) => (a += item.totalNominal), 0);
  $: totalBiaya = filteredDataBiaya.reduce((a, item) => (a += item.totalNominal), 0);

  let method: string = 'Monthly';
  let month: string = getCurrentMonth();
  let year: string = getCurrentYear();
  let isLoading = false;
  async function searchDataJurnal() {
    try {
      const body = {
        year,
        month: method === 'Monthly' ? month : null
      };

      isLoading = true;
      const res = await fetch('/api/searchJurnal', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const dataRes = await res.json();
      dataJurnal = dataRes;
      isLoading = false;
    } catch (error) {
      toast.error('Something went wrong, please try again');
    }
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
  <div class="flex justify-between rounded-lg border-2 bg-white px-4 py-4">
    <div class="flex gap-4">
      <Select.Root
        selected={{ label: 'Monthly', value: 'Monthly' }}
        onSelectedChange={(v) => {
          v && (method = v.value);
        }}
      >
        <Select.Trigger class="w-[180px]">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="Monthly">Monthly</Select.Item>
          <Select.Item value="Yearly">Yearly</Select.Item>
        </Select.Content>
      </Select.Root>
      {#if method === 'Monthly'}
        <Select.Root
          selected={{ label: getCurrentMonthName(), value: getCurrentMonth() }}
          onSelectedChange={(v) => {
            v && (month = v.value);
          }}
        >
          <Select.Trigger class="w-[180px]">
            <Select.Value placeholder="Theme" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="01">January</Select.Item>
            <Select.Item value="02">February</Select.Item>
            <Select.Item value="03">March</Select.Item>
            <Select.Item value="04">April</Select.Item>
            <Select.Item value="05">May</Select.Item>
            <Select.Item value="06">June</Select.Item>
            <Select.Item value="07">July</Select.Item>
            <Select.Item value="08">August</Select.Item>
            <Select.Item value="09">September</Select.Item>
            <Select.Item value="10">October</Select.Item>
            <Select.Item value="11">November</Select.Item>
            <Select.Item value="12">December</Select.Item>
          </Select.Content>
        </Select.Root>
      {/if}
      <Select.Root
        selected={{ label: getCurrentYear(), value: getCurrentYear() }}
        onSelectedChange={(v) => {
          v && (year = v.value);
        }}
      >
        <Select.Trigger class="w-[180px]">
          <Select.Value placeholder="Theme" />
        </Select.Trigger>
        <Select.Content>
          {#each getYears(2023) as item}
            <Select.Item value={item.toString()}>{item.toString()}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
    <Button disabled={isLoading} on:click={searchDataJurnal}>Search</Button>
  </div>
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
        {@const daftarAkun = data.dataAkun.filter((i) => i.kategori === item)}
        <tr class="border-b-2 odd:bg-gray-100">
          <td colspan="2" class="p-2 font-semibold">
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </td>
        </tr>
        {#each daftarAkun as akun}
          {@const dataTotalAkun = dataJurnal.find((item) => item.nama_akun === akun.nama)}
          <tr class="border-b-2 odd:bg-gray-100">
            <td class="p-2 indent-10">{akun.nama}</td>
            <td class="pr-10 text-right">{dataTotalAkun ? dataTotalAkun.totalNominal : 0}</td>
          </tr>
        {/each}
        {#if i === stopIndexPendapatan}
          <tr class="border-b-2 text-blue-400 odd:bg-gray-100">
            <td class="p-2 font-semibold"> Total Pendapatan </td>
            <td class="pr-10 text-right">{totalPendapatan}</td>
          </tr>
        {/if}
        {#if i === limitedItems.length - 1}
          <tr class="border-b-2 text-blue-400 odd:bg-gray-100">
            <td class="p-2 font-semibold"> Total Biaya </td>
            <td class="pr-10 text-right">{totalBiaya}</td>
          </tr>
        {/if}
      {/each}
    </table>
  </div>
</div>
