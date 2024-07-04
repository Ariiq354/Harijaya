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
        <Breadcrumb.Page>Pembayaran Utang</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1 text-3xl font-bold">Detail Pembayaran Utang</div>
    <Button
      variant="outline"
      href="/dashboard/pembayaranUtang"
      class="p-2 shadow-lg"
      aria-label="go back"
    >
      <ArrowLeft />
    </Button>
  </div>
  <hr class="border-black" />

  <Card.Root class="pt-4">
    <Card.Content>
      <div class="w-full">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="flex w-full flex-col gap-2 py-2">
            <Label>No. Pembayaran</Label>
            <Input disabled value={data.data.noTransaksi} />
          </div>
          <div class="flex w-full flex-col gap-2 py-2">
            <Label>Total</Label>
            <Input disabled value={data.data.totalNilai} />
          </div>
        </div>
        <hr class="my-4" />
        <Table.Root class="w-full">
          <Table.Header>
            <Table.Row>
              <Table.Head>No.</Table.Head>
              <Table.Head>No Faktur</Table.Head>
              <Table.Head>Nilai</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each data.data.utangItem as item, i (item)}
              {@const utang = data.utang.find((utang) => utang.id === item.noUtang)}
              <Table.Row>
                <Table.Cell>{i + 1}</Table.Cell>
                <Table.Cell>
                  {utang?.fakturPembelian.noFaktur}
                </Table.Cell>
                <Table.Cell>
                  <Input disabled type="number" value={item.nilai} />
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </div>
    </Card.Content>
  </Card.Root>
</div>
