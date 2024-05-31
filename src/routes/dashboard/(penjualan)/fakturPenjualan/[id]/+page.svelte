<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Table from '$lib/components/ui/table';
  import { Textarea } from '$lib/components/ui/textarea';
  import { ArrowLeft, Loader2 } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import SuperDebug, { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import type { PageData } from './$types';
  import { formSchema } from './schema';

  export let data: PageData;

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    async onUpdate({ form }) {
      if (form.valid) {
        toast.success('Submit berhasil');
        await goto('/dashboard/fakturPenjualan');
      }
    },
    onError(event) {
      toast.error(event.result.error.message);
    }
  });
  const { form: formData, enhance, submitting } = form;
  $formData.id = data.id;
  $formData.pelangganId = data.pemesananPenjualan?.pelangganId as string;
  $: $formData.total =
    (data.pemesananPenjualan?.total as number) +
    Number($formData.biayaKirim) +
    Number($formData.biayaLainnya) +
    Number($formData.pembulatan);
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
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Buat Faktur Penjualan</h1>
    </div>
    <Button variant="outline" href="/dashboard/pemesananPenjualan" class="p-2 shadow-lg">
      <ArrowLeft />
    </Button>
  </div>
  <hr class="border-black" />

  <Card.Root class="pt-4">
    <Card.Content>
      <form method="POST" use:enhance class="w-full">
        <Form.Field {form} name="id" class="hidden">
          <Form.Control let:attrs>
            <input hidden name={attrs.name} bind:value={$formData.id} />
          </Form.Control>
        </Form.Field>
        <Form.Field {form} name="pelangganId" class="hidden">
          <Form.Control let:attrs>
            <input hidden name={attrs.name} bind:value={$formData.pelangganId} />
          </Form.Control>
        </Form.Field>
        <Form.Field {form} name="total" class="hidden">
          <Form.Control let:attrs>
            <input hidden name={attrs.name} bind:value={$formData.total} />
          </Form.Control>
        </Form.Field>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div class="mt-4 flex flex-col gap-2">
              <Label>Nama Supplier</Label>
              <Input readonly value={data.pemesananPenjualan?.pelanggan?.name} />
            </div>
            <div class="mt-4 flex flex-col gap-2">
              <Label>Email</Label>
              <Input readonly value={data.pemesananPenjualan?.pelanggan?.email} />
            </div>
          </div>
          <div class="flex w-full flex-col gap-2 py-2">
            <Label>Alamat</Label>
            <Textarea rows={8} readonly value={data.pemesananPenjualan?.pelanggan?.address} />
          </div>
        </div>
        <hr class="my-4" />
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="flex w-full flex-col gap-2 py-2">
            <Label>No. Pemesanan</Label>
            <Input readonly value={data.pemesananPenjualan?.noPenjualan} />
          </div>
          <div class="flex w-full flex-col gap-2 py-2">
            <Label>Tanggal Pemesanan</Label>
            <Input readonly value={data.pemesananPenjualan?.tanggal} />
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Field {form} name="noFaktur">
            <Form.Control let:attrs>
              <Form.Label>No. Faktur</Form.Label>
              <Input {...attrs} bind:value={$formData.noFaktur} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <Form.Field {form} name="tanggal">
            <Form.Control let:attrs>
              <Form.Label>Tanggal Faktur</Form.Label>
              <Input class="block" type="date" {...attrs} bind:value={$formData.tanggal} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
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
            {#if data.pemesananPenjualan}
              {#each data.pemesananPenjualan.produk as item, i (item)}
                <Table.Row>
                  <Table.Cell>{i + 1}</Table.Cell>
                  <Table.Cell>
                    <Input readonly value={item.barang?.name} />
                  </Table.Cell>
                  <Table.Cell>
                    <Input type="number" readonly value={item.barang?.harga} />
                  </Table.Cell>
                  <Table.Cell>
                    <Input type="number" readonly value={item.kuantitas} />
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
            <Form.Field {form} name="catatan">
              <Form.Control let:attrs>
                <Form.Label>Pesan</Form.Label>
                <Textarea rows={8} {...attrs} bind:value={$formData.catatan} />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="flex w-full flex-col gap-2 py-2">
                <Label>Nama Bank</Label>
                <Input readonly value={data.pemesananPenjualan?.pelanggan?.namaBank} />
              </div>
              <div class="flex w-full flex-col gap-2 py-2">
                <Label>No. Rekening</Label>
                <Input readonly value={data.pemesananPenjualan?.pelanggan?.noRekening} />
              </div>
            </div>
            <div class="flex w-full flex-col gap-2 py-2">
              <Label>Atas Nama</Label>
              <Input readonly value={data.pemesananPenjualan?.pelanggan?.atasNama} />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex w-full justify-between">
              <div>Subtotal:</div>
              <div>
                {data.pemesananPenjualan?.total}
              </div>
            </div>
            <div class="flex w-full justify-between">
              <div>Biaya Kirim:</div>
              <Form.Field {form} name="biayaKirim">
                <Form.Control let:attrs>
                  <Input type="number" {...attrs} bind:value={$formData.biayaKirim} />
                </Form.Control>
                <Form.FieldErrors />
              </Form.Field>
            </div>
            <div class="flex w-full justify-between">
              <div>Biaya Lainnya:</div>
              <Form.Field {form} name="biayaLainnya">
                <Form.Control let:attrs>
                  <Input type="number" {...attrs} bind:value={$formData.biayaLainnya} />
                </Form.Control>
                <Form.FieldErrors />
              </Form.Field>
            </div>
            <div class="flex w-full justify-between">
              <div>Pembulatan:</div>
              <Form.Field {form} name="pembulatan">
                <Form.Control let:attrs>
                  <Input type="number" {...attrs} bind:value={$formData.pembulatan} />
                </Form.Control>
                <Form.FieldErrors />
              </Form.Field>
            </div>
            <div class="flex w-full justify-between">
              <div>Grand Total:</div>
              <div>
                {$formData.total}
              </div>
            </div>
          </div>
        </div>

        <Form.Button type="submit" disabled={$submitting} class="col-span-2 mt-4">
          {#if $submitting}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          {/if}
          Simpan
        </Form.Button>
      </form>
    </Card.Content>
  </Card.Root>
</div>
