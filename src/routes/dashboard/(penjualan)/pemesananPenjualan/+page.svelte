<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Plus } from 'lucide-svelte';
  import type { PageData } from './$types';
  import DataTable from './components/data-table.svelte';

  export let data: PageData;
</script>

<div class="flex flex-col gap-4">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Pemesanan Penjualan</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Pemesanan Penjualan</h1>
    </div>
    <Button
      href="/dashboard/pemesananPenjualan/new"
      variant="outline"
      class="p-2 shadow-lg"
      title="add data"
    >
      <Plus />
    </Button>
  </div>
  <hr class="border-black" />
  <Card.Root>
    <Card.Content>
      {#await data.pemesananPenjualanData}
        Loading data...
      {:then data}
        <DataTable {data} />
      {/await}
    </Card.Content>
  </Card.Root>
</div>
