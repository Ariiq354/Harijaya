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
        <Breadcrumb.Page>Pembayaran Piutang</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1 text-3xl font-bold">Detail Pembayaran Piutang</div>
    <Button
      variant="outline"
      href="/dashboard/pembayaranPiutang"
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
            <Input
              class="text-right"
              disabled
              value={data.data.totalNilai.toLocaleString('id-ID')}
            />
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
            {#each data.data.piutangItem as item, i (item)}
              {@const piutang = data.piutang.find((piutang) => piutang.id === item.noPiutang)}
              <Table.Row>
                <Table.Cell>{i + 1}</Table.Cell>
                <Table.Cell>
                  {piutang?.fakturPembelian.noFaktur}
                </Table.Cell>
                <Table.Cell>
                  <Input class="text-right" disabled value={item.nilai.toLocaleString('id-ID')} />
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </div>
    </Card.Content>
  </Card.Root>
</div>
