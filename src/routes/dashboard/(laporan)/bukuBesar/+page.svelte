<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Plus } from 'lucide-svelte';
  import * as Select from '$lib/components/ui/select';
  import type { PageData } from './$types';
  import DataTable from './components/data-table.svelte';

  export let data: PageData;

  // $: selectedAkun = $data.noAkun
  //   ? {
  //       label: data.akun.find((i) => i.kode == $data.noAkun)?.nama,
  //       value: $data.noAkun
  //     }
  //   : undefined;

  let selectedAkun;
  let searchQuery = '';
  let selectedYear = '';
  $: filteredAkun = data.akun.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );
  let selectedPeriod; // Will hold the selected value

  // Options for the dropdown
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

  let selectedMonth; // Will hold the selected value
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
      <div class="mt-3 flex items-center justify-between">
        <Select.Root
          onSelectedChange={(v) => {
            selectedAkun = v?.value;
          }}
        >
          <Select.Trigger id="noAkun">
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
        <Select.Root
          onSelectedChange={(v) => {
            selectedPeriod = v?.value;
          }}
        >
          <Select.Trigger id="selectType">
            <Select.Value placeholder="Select Period" />
          </Select.Trigger>

          <Select.Content class="max-h-40 max-w-sm overflow-auto">
            <!-- List of dropdown items -->
            {#each options as option}
              <Select.Item value={option.value} label={option.label} />
            {/each}
          </Select.Content>
        </Select.Root>
        <Select.Root
          onSelectedChange={(v) => {
            selectedMonth = v?.value;
          }}
        >
          <Select.Trigger id="selectMonth">
            <Select.Value placeholder="Select Month" />
          </Select.Trigger>

          <Select.Content class="max-h-40 max-w-sm overflow-auto">
            <!-- List of dropdown items -->
            {#each months as month}
              <Select.Item value={month.value} label={month.label} />
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <DataTable data={data.jurnalData} />
    </Card.Content>
  </Card.Root>
</div>
