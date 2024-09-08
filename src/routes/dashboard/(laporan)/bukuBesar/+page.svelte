<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Plus } from 'lucide-svelte';
  import * as Select from '$lib/components/ui/select';
  import type { PageData } from './$types';
  import DataTable from './components/data-table.svelte';

  export let data: PageData;

  let selectedAkun;
  let searchQuery = '';

  $: filteredAkun = data.akun.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );
  let selectedPeriod: String = 'monthly';
  let selectedYear: String = new Date().getFullYear().toString();
  let selectedMonth: String = (new Date().getMonth() + 1).toString();

  // Generate list of years from 2023 to the current year
  const currentYear = new Date().getFullYear();
  let years = [];
  for (let year = 2023; year <= currentYear; year++) {
    years.push({ value: year.toString(), label: year.toString() });
  }

  let options = [
    { value: 'yearly', label: 'Yearly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'period', label: 'Period' }
  ];

  let months = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
  ];

  function formatNumber(num: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(num);
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
        <Breadcrumb.Page>Buku Besar</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>

  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Buku Besar</h1>
    </div>
  </div>

  <hr class="border-black" />

  <Card.Root>
    <Card.Content>
      <div class="flex justify-between rounded-lg border-2 bg-white px-4 py-4">
        <div class="flex gap-4">
          <!-- Select for Akun -->

          <Select.Root
            onSelectedChange={(v) => {
              selectedAkun = v?.value;
            }}
          >
            <Select.Trigger id="noAkun" class="w-[180px]">
              <Select.Value class="capitalize" placeholder="Pilih Akun" />
            </Select.Trigger>

            <!-- Search input field -->
            <Select.Content class="max-h-40 max-w-sm overflow-auto">
              <input
                type="text"
                placeholder="Search Akun..."
                class="w-full border p-2"
                bind:value={searchQuery}
              />
              {#if filteredAkun.length}
                {#each filteredAkun as item}
                  <Select.Item value={item.kode} label={item.nama} />
                {/each}
              {:else}
                <Select.Item disabled value="" label="No Result Found" />
              {/if}
            </Select.Content>
          </Select.Root>
          <!-- Select for Period -->

          <Select.Root
            selected={{ label: 'Montly', value: 'montly' }}
            onSelectedChange={(v) => {
              v && (selectedPeriod = v?.value);
            }}
          >
            <Select.Trigger id="selectType" class="w-[180px]">
              <Select.Value placeholder="Select Period" />
            </Select.Trigger>

            <Select.Content class="max-h-40 max-w-sm overflow-auto">
              {#each options as option}
                <Select.Item value={option.value} label={option.label} />
              {/each}
            </Select.Content>
          </Select.Root>
          <!-- Select for Year -->

          <Select.Root
            selected={{ label: '2024', value: '2024' }}
            onSelectedChange={(v) => {
              v && (selectedYear = v?.value);
            }}
          >
            <Select.Trigger id="selectYear" class="w-[180px]">
              <Select.Value placeholder="Select Year" />
            </Select.Trigger>

            <Select.Content class="max-h-40 max-w-sm overflow-auto">
              {#each years as year}
                <Select.Item value={year.value} label={year.label} />
              {/each}
            </Select.Content>
          </Select.Root>
          <!-- Select for Month -->

          {#if selectedPeriod !== 'yearly'}
            <Select.Root
              selected={{ label: 'Januari', value: '01' }}
              onSelectedChange={(v) => {
                v && (selectedMonth = v?.value);
              }}
            >
              <Select.Trigger id="selectMonth" class="w-[180px]">
                <Select.Value placeholder="Select Month" />
              </Select.Trigger>

              <Select.Content class="max-h-40 max-w-sm overflow-auto">
                {#each months as month}
                  <Select.Item value={month.value} label={month.label} />
                {/each}
              </Select.Content>
            </Select.Root>
          {/if}
        </div>
        <Button>Search</Button>
      </div>

      <!-- Display the data in the table -->
      <table class="mt-4 w-full border-collapse">
        <thead>
          <tr>
            <th class="border p-2">Deskripsi</th>
            <th class="border p-2">Tanggal</th>
            <th class="border p-2">Kode</th>
            <th class="border p-2">Debit</th>
            <th class="border p-2">Kredit</th>
            <th class="border p-2">Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr class=" border p-2 odd:bg-gray-100"
            ><td class="p-2">Saldo Awal</td>
            <td class="p-2"></td>
            <td class="p-2"></td>
            <td class="p-2"></td>
            <td class="p-2"></td>
            <td class="p-2">0</td>
          </tr>
          {#each data.jurnalData as entry}
            <tr class=" odd:bg-gray-100">
              <td class="p-2">{entry.deskripsi}</td>
              <td class="p-2">{entry.tanggal}</td>
              <td class="p-2">{entry.kode_transaksi}</td>
              <td class="p-2">
                {#if entry.nominal > 0}
                  {formatNumber(entry.nominal)}
                {/if}
              </td>
              <td class="p-2">
                {#if entry.nominal < 0}
                  {formatNumber(Math.abs(entry.nominal))}
                {/if}
              </td>
              <td class="p-2"> </td>
            </tr>
          {/each}
          <tr class=" border p-2 odd:bg-gray-100"
            ><td class="p-2">Saldo Akhir</td>
            <td class="p-2"></td>
            <td class="p-2"></td>
            <td class="p-2"></td>
            <td class="p-2"></td>
            <td class="p-2">0</td>
          </tr>
        </tbody>
      </table>
    </Card.Content>
  </Card.Root>
</div>
