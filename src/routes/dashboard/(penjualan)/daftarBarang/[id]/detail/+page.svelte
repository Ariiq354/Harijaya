<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Table from '$lib/components/ui/table';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
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
        <Breadcrumb.Page>Daftar Barang</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1 text-3xl font-bold">Detail Barang</div>
    <Button variant="outline" href="/dashboard/daftarBarang" class="p-2 shadow-lg">
      <ArrowLeft />
    </Button>
  </div>
  <hr class="border-black" />

  <Card.Root class="pt-4">
    <Card.Content>
      <div class="flex w-full flex-col gap-2 py-2">
        <Label>Nama Barang</Label>
        <Input disabled value={data.data.name} />
      </div>
      <div class="flex w-full flex-col gap-2 py-2">
        <Label>Deskripsi</Label>
        <Input disabled value={data.data.deskripsi} />
      </div>
      <div class="flex w-full flex-col gap-2 py-2">
        <Label>Tipe Bahan</Label>
        {#if data.data.tipe !== 1}
          <Input disabled value="Barang Jadi" />
        {:else}
          <Input disabled value="Barang Mentah" />
        {/if}
      </div>
      <div class="flex w-full flex-col gap-2 py-2">
        <Label>Satuan</Label>
        <Input disabled value={data.data.satuan} />
      </div>
      <h1 class="my-4 font-semibold">Detail Stok</h1>
      <Table.Root class="">
        <Table.Header>
          <Table.Row>
            <Table.Head>No.</Table.Head>
            <Table.Head>Tanggal</Table.Head>
            <Table.Head>Harga</Table.Head>
            <Table.Head>Stok</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each data.data.barangHarga as item, i (item.id)}
            <Table.Row>
              <Table.Cell>{i + 1}</Table.Cell>
              <Table.Cell>{item.createdAt}</Table.Cell>
              <Table.Cell>{item.harga}</Table.Cell>
              <Table.Cell>{item.stok}</Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </Card.Content>
  </Card.Root>
</div>
