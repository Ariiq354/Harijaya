<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import * as Select from '$lib/components/ui/select';
  import type { PageData } from './$types';
  import DataTable from './components/data-table.svelte';
  import { getCurrentMonth, getCurrentMonthName, getCurrentYear, getYears } from '$lib/utils';
  import { toast } from 'svelte-sonner';
  import { Input } from '$lib/components/ui/input';

  export let data: PageData;

  let dataJurnal = data.data;

  let method: string = 'Monthly';
  let month: string = getCurrentMonth();
  let year: string = getCurrentYear();
  let isLoading = false;
  let startDate = '';
  let endDate = '';
  async function searchDataJurnal() {
    try {
      const body = {
        year,
        month: method === 'Monthly' ? month : null,
        period: method === 'Period' ? [startDate, endDate] : null
      };

      isLoading = true;
      const res = await fetch('/api/searchJurnalTransaksi', {
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
        <Breadcrumb.Page>Daftar Transaksi</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Daftar Transaksi</h1>
    </div>
  </div>
  <hr class="border-black" />
  <Card.Root>
    <Card.Content class="flex flex-col gap-4 pt-6">
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
              <Select.Item value="Period">Period</Select.Item>
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

          {#if method === 'Period'}
            <div class="flex gap-4">
              <p class="flex items-center whitespace-nowrap">Start Date:</p>
              <Input class="block" type="date" bind:value={startDate} />
            </div>
            <div class="flex gap-4">
              <p class="flex items-center whitespace-nowrap">End Date:</p>
              <Input class="block" type="date" bind:value={endDate} />
            </div>
          {:else}
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
          {/if}
        </div>
        <Button disabled={isLoading} on:click={searchDataJurnal}>Search</Button>
      </div>
      <DataTable data={dataJurnal} />
    </Card.Content>
  </Card.Root>
</div>
