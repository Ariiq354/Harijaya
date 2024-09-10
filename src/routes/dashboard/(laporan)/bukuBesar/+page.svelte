<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Plus } from 'lucide-svelte';
  import * as Select from '$lib/components/ui/select';
  import type { PageData } from './$types';
  import { toast } from 'svelte-sonner';
  import { getCurrentMonth, getCurrentMonthName, getCurrentYear } from '$lib/utils';
  import DataTable from './components/data-table.svelte';

  export let data: PageData;

  let selectedAkun: String;
  let searchQuery = '';

  let dataJurnal = data.jurnalData;
  let totalAwal = data.totalAwal;
  let totalAkhir = data.totalAkhir;

  $: filteredAkun = data.akun.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );
  let period: string = 'monthly';
  let month: string = getCurrentMonth();
  let year: string = getCurrentYear();

  let isLoading = false;

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

  async function searchDataJurnal() {
    try {
      const body = {
        year,
        month: period === 'monthly' ? month : null,
        noAkun: selectedAkun
      };

      isLoading = true;
      const res = await fetch('/api/searchJurnalAkun', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const dataRes = await res.json();
      data = {
        jurnalData: dataRes.bukuBesar,
        totalAwal: dataRes.before,
        totalAkhir: dataRes.after,
        akun: data.akun
      };
      dataJurnal = dataRes.bukuBesar;
      totalAwal = dataRes.before;
      totalAkhir = dataRes.after;
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
      <div class="mb-4 mt-6 flex justify-between rounded-lg border-2 bg-white px-4 py-4">
        <div class="flex gap-4">
          <!-- Select for Akun -->

          <Select.Root
            selected={{ label: '', value: '' }}
            onSelectedChange={(v) => {
              v && (selectedAkun = v?.value);
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
              v && (period = v?.value);
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
            selected={{ label: getCurrentYear(), value: getCurrentYear() }}
            onSelectedChange={(v) => {
              v && (year = v?.value);
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

          {#if period !== 'yearly'}
            <Select.Root
              selected={{ label: getCurrentMonthName(), value: getCurrentMonth() }}
              onSelectedChange={(v) => {
                v && (month = v?.value);
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
        <Button disabled={isLoading} on:click={searchDataJurnal}>Search</Button>
      </div>
      <DataTable {data} />
      <!-- Display the data in the table -->
    </Card.Content>
  </Card.Root>
</div>
