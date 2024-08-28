<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Table from '$lib/components/ui/table';
  import { Textarea } from '$lib/components/ui/textarea';
  import { ArrowLeft } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  const subTotal = data.faktur.produk.reduce((acc, item) => {
    acc += item.harga * item.kuantitas;
    return acc;
  }, 0);
</script>

<div class="flex flex-col gap-4">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Faktur Pembelian</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1 text-3xl font-bold">Detail Faktur Pembelian</div>
    <Button
      variant="outline"
      href="/dashboard/fakturPembelian"
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
          <div>
            <div class="flex w-full flex-col gap-2 py-2">
              <Label>Nama Supplier</Label>
              <Input disabled value={data.faktur.supplier?.name} />
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="mt-4 flex flex-col gap-2">
                <Label>Nama Bank</Label>
                <Input disabled value={data.faktur.supplier?.namaBank} />
              </div>
              <div class="mt-4 flex flex-col gap-2">
                <Label>No. Rekening</Label>
                <Input disabled value={data.faktur.supplier?.noRekening} />
              </div>
            </div>
            <div class="mt-4 flex flex-col gap-2">
              <Label>Nama Rekening</Label>
              <Input disabled value={data.faktur.supplier?.namaRekening} />
            </div>
          </div>
          <div class="flex w-full flex-col gap-2 pt-2">
            <Label>Alamat</Label>
            <Textarea class="h-full" disabled value={data.faktur.supplier?.address} />
          </div>
        </div>
        <hr class="my-4" />
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="flex w-full flex-col gap-2 py-2">
            <Label>No. Faktur</Label>
            <Input disabled value={data.faktur.noFaktur} />
          </div>
          <div class="flex w-full flex-col gap-2 py-2">
            <Label>Tanggal</Label>
            <Input disabled value={data.faktur.tanggal} />
          </div>
        </div>
        <hr class="my-4" />
        <div class="grid grid-cols-1 overflow-auto">
          <Table.Root class="w-full">
            <Table.Header>
              <Table.Row>
                <Table.Head>No.</Table.Head>
                <Table.Head>Barang</Table.Head>
                <Table.Head>Harga</Table.Head>
                <Table.Head>Kuantitas</Table.Head>
                <Table.Head>Jumlah</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each data.faktur.produk as item, i (item)}
                <Table.Row>
                  <Table.Cell>{i + 1}</Table.Cell>
                  <Table.Cell>
                    <Input disabled value={item.barang?.name} />
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      disabled
                      class="text-right"
                      type="number"
                      value={item.harga.toLocaleString('id-ID')}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      disabled
                      class="text-right"
                      type="number"
                      value={item.kuantitas.toLocaleString('id-ID')}
                    />
                  </Table.Cell>
                  <Table.Cell class="text-right">
                    {(item.harga * item.kuantitas).toLocaleString('id-ID')}
                  </Table.Cell>
                </Table.Row>
              {/each}
            </Table.Body>
          </Table.Root>
        </div>
        <hr class="my-4" />
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div class="flex w-full flex-col gap-2 py-2">
              <Label>Catatan</Label>
              <Textarea rows={6} disabled value={data.faktur.catatan} />
            </div>
            <div class="relative h-[200px] w-[200px] overflow-hidden rounded-md">
              <a href={data.faktur.lampiran} target="_blank">
                <img class="h-full object-cover" alt="lampiran" src={data.faktur.lampiran} />
              </a>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex w-full justify-between">
              <div>Subtotal:</div>
              <div>
                {subTotal.toLocaleString('id-ID')}
              </div>
            </div>
            <div class="flex w-full justify-between">
              <div>Biaya Kirim:</div>
              <div>
                {data.faktur.biayaKirim.toLocaleString('id-ID')}
              </div>
            </div>
            <div class="flex w-full justify-between">
              <div>Biaya Lainnya:</div>
              <div>
                {data.faktur.biayaLainnya.toLocaleString('id-ID')}
              </div>
            </div>
            <div class="flex w-full justify-between">
              <div>Grand Total:</div>
              <div>
                {data.faktur.total.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card.Content>
  </Card.Root>
</div>
