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

  const bahanMentah = data.data.produkProses.filter((i) => i.tipeBarang === 0);
  const barangJadi = data.data.produkProses.filter((i) => i.tipeBarang === 1);
</script>

<div class="flex flex-col gap-4">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Proses Produksi</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Detail Proses Produksi</h1>
    </div>
    <Button
      variant="outline"
      href="/dashboard/prosesProduksi"
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
          <Label>No. Proses</Label>
          <Input disabled value={data.data.noProses} />
        </div>
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>Tanggal</Label>
          <Input disabled value={data.data.tanggal} />
        </div>
      </div>
      <hr class="my-4" />
      <Label>List Bahan Mentah</Label>
      <div class="grid grid-cols-1 overflow-auto">
        <Table.Root class="w-full ">
          <Table.Header>
            <Table.Row>
              <Table.Head>No.</Table.Head>
              <Table.Head>Barang</Table.Head>
              <Table.Head>Kuantitas</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each bahanMentah as _, i (i)}
              <Table.Row>
                <Table.Cell>
                  {i + 1}
                </Table.Cell>
                <Table.Cell>
                  <Input disabled value={bahanMentah[i].barang?.name} />
                </Table.Cell>
                <Table.Cell>
                  <Input disabled value={bahanMentah[i].kuantitas} />
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </div>
      <hr class="my-4" />
      <Label>List Bahan Jadi</Label>
      <div class="grid grid-cols-1 overflow-auto">
        <Table.Root class="w-full">
          <Table.Header>
            <Table.Row>
              <Table.Head>No.</Table.Head>
              <Table.Head>Barang</Table.Head>
              <Table.Head>Kuantitas</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each barangJadi as _, i (i)}
              <Table.Row>
                <Table.Cell>
                  {i + 1}
                </Table.Cell>
                <Table.Cell>
                  <Input disabled value={barangJadi[i].barang?.name} />
                </Table.Cell>
                <Table.Cell>
                  <Input disabled value={barangJadi[i].kuantitas} />
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </div>
    </Card.Content>
  </Card.Root>
</div>
