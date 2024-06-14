<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Table from '$lib/components/ui/table';
  import { ArrowLeft } from 'lucide-svelte';
  import type { PageData } from './$types';

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
        <Breadcrumb.Page>Stok Fisik</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Detail Stok Fisik</h1>
    </div>
    <Button
      variant="outline"
      href="/dashboard/stokFisik"
      class="p-2 shadow-lg"
      aria-label="go back"
    >
      <ArrowLeft />
    </Button>
  </div>
  <hr class="border-black" />

  <Card.Root class="pt-4">
    <Card.Content>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>No. Stok Fisik</Label>
          <Input disabled value={data.data.noStokFisik} />
        </div>
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>Tanggal</Label>
          <Input disabled value={data.data.tanggal} />
        </div>
      </div>
      <hr class="my-4" />
      <Table.Root class="w-full">
        <Table.Row>
          <Table.Head>No.</Table.Head>
          <Table.Head>Barang</Table.Head>
          <Table.Head>Tipe</Table.Head>
          <Table.Head>Kuantitas</Table.Head>
        </Table.Row>
        {#each data.data.produkStok as item, i (i)}
          <Table.Row>
            <Table.Cell>
              {i + 1}
            </Table.Cell>
            <Table.Cell>
              <Input disabled value={data.data.produkStok[i].barang.name} />
            </Table.Cell>
            <Table.Cell>
              {#if data.data.produkStok[i].tipe === 0}
                -
              {:else}
                +
              {/if}
            </Table.Cell>
            <Table.Cell>
              <Input type="number" disabled value={data.data.produkStok[i].kuantitas} />
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Root>
    </Card.Content>
  </Card.Root>
</div>
