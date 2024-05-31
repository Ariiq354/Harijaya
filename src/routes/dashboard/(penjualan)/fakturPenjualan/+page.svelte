<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import * as Card from '$lib/components/ui/card';
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
        <Breadcrumb.Page>Faktur Penjualan</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex flex-col">
    <h1 class="mt-1 text-3xl font-bold">Faktur Penjualan</h1>
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
