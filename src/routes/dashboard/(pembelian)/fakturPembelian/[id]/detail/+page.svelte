<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Table from '$lib/components/ui/table';
  import { Textarea } from '$lib/components/ui/textarea';
  import { ArrowLeft, Loader2 } from 'lucide-svelte';
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
        <Breadcrumb.Page>Faktur Pembelian</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Detail Faktur Pembelian</h1>
    </div>
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
            <div class="mt-4 flex flex-col gap-2">
              <Label>Nama Supplier</Label>
              <Input disabled value={data.data.pemesananPembelian?.supplier?.name} />
            </div>
            <div class="mt-4 flex flex-col gap-2">
              <Label>Email</Label>
              <Input disabled value={data.data.pemesananPembelian?.supplier?.email} />
            </div>
          </div>
          <div class="flex w-full flex-col gap-2 py-2">
            <Label>Alamat</Label>
            <Textarea rows={6} disabled value={data.data.pemesananPembelian?.supplier?.address} />
          </div>
        </div>
        <hr class="my-4" />
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="flex w-full flex-col gap-2 py-2">
            <Label>No. Pemesanan</Label>
            <Input disabled value={data.data.pemesananPembelian?.noPembelian} />
          </div>
          <div class="flex w-full flex-col gap-2 py-2">
            <Label>Tanggal Pemesanan</Label>
            <Input disabled value={data.data.pemesananPembelian?.tanggal} />
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="flex w-full flex-col gap-2 py-2">
            <Label>No. Faktur</Label>
            <Input disabled value={data.data.noFaktur} />
          </div>
          <div class="flex w-full flex-col gap-2 py-2">
            <Label>Tanggal Faktur</Label>
            <Input disabled value={data.data.tanggal} />
          </div>
        </div>
        <hr class="my-4" />
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
            {#if data.data.pemesananPembelian}
              {#each data.data.pemesananPembelian.produk as item, i (item)}
                <Table.Row>
                  <Table.Cell>{i + 1}</Table.Cell>
                  <Table.Cell>
                    <Input disabled value={item.barang?.name} />
                  </Table.Cell>
                  <Table.Cell>
                    {item.barang?.harga}
                  </Table.Cell>
                  <Table.Cell>
                    <Input type="number" disabled value={item.kuantitas} />
                  </Table.Cell>
                  <Table.Cell>
                    {#if item.barang}
                      {item.barang.harga * item.kuantitas}
                    {:else}
                      0
                    {/if}
                  </Table.Cell>
                </Table.Row>
              {/each}
            {/if}
          </Table.Body>
        </Table.Root>
        <hr class="my-4" />
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div class="flex w-full flex-col gap-2 py-2">
              <Label>Catatan</Label>
              <Textarea rows={6} disabled value={data.data.catatan} />
            </div>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="flex w-full flex-col gap-2 py-2">
                <Label>Nama Bank</Label>
                <Input disabled value={data.data.pemesananPembelian?.supplier?.namaBank} />
              </div>
              <div class="flex w-full flex-col gap-2 py-2">
                <Label>No. Rekening</Label>
                <Input disabled value={data.data.pemesananPembelian?.supplier?.noRekening} />
              </div>
            </div>
            <div class="flex w-full flex-col gap-2 py-2">
              <Label>Atas Nama</Label>
              <Input disabled value={data.data.pemesananPembelian?.supplier?.atasNama} />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex w-full justify-between">
              <div>Subtotal:</div>
              <div>
                {data.data.pemesananPembelian?.total}
              </div>
            </div>
            <div class="flex w-full justify-between">
              <div>Biaya Kirim:</div>
              <Input class="w-fit" disabled value={data.data.biayaKirim} />
            </div>
            <div class="flex w-full justify-between">
              <div>Biaya Lainnya:</div>
              <Input class="w-fit" disabled value={data.data.biayaLainnya} />
            </div>
            <div class="flex w-full justify-between">
              <div>Grand Total:</div>
              <div>
                {data.data.total}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card.Content>
  </Card.Root>
</div>
