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
        await goto('/dashboard/penerimaanBarang');
      }
    },
    onError(event) {
      toast.error(event.result.error.message);
    }
  });
  const { form: formData, enhance, submitting } = form;
  $formData.id = data.id;
  $formData.supplierId = data.pemesananPembelian?.supplierId as string;
</script>

<div class="flex flex-col gap-4">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Penerimaan Barang</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Buat Penerimaan Barang</h1>
    </div>
    <Button variant="outline" href="/dashboard/pemesananPembelian" class="p-2 shadow-lg">
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
        <Form.Field {form} name="supplierId" class="hidden">
          <Form.Control let:attrs>
            <input hidden name={attrs.name} bind:value={$formData.supplierId} />
          </Form.Control>
        </Form.Field>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div class="mt-4 flex flex-col gap-2">
              <Label>Nama Supplier</Label>
              <Input readonly value={data.pemesananPembelian?.supplier?.name} />
            </div>
            <div class="mt-4 flex flex-col gap-2">
              <Label>Email</Label>
              <Input readonly value={data.pemesananPembelian?.supplier?.email} />
            </div>
          </div>
          <div class="flex w-full flex-col gap-2 py-2">
            <Label>Alamat</Label>
            <Textarea rows={8} readonly value={data.pemesananPembelian?.supplier?.address} />
          </div>
        </div>
        <hr class="my-4" />
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <div class="flex w-full flex-col gap-2 py-2">
              <Label>No. Pemesanan</Label>
              <Input readonly value={data.pemesananPembelian?.noPembelian} />
            </div>
            <div class="flex w-full flex-col gap-2 py-2">
              <Form.Field {form} name="noSuratJalan">
                <Form.Control let:attrs>
                  <Form.Label>No. Surat Jalan</Form.Label>
                  <Input readonly {...attrs} bind:value={$formData.noSuratJalan} />
                </Form.Control>
                <Form.FieldErrors />
              </Form.Field>
              <Form.Field {form} name="tanggal">
                <Form.Control let:attrs>
                  <Form.Label>Tanggal Pengiriman</Form.Label>
                  <Input readonly type="date" {...attrs} bind:value={$formData.tanggal} />
                </Form.Control>
                <Form.FieldErrors />
              </Form.Field>
            </div>
            <div>
              <Form.Field {form} name="noPelacakan">
                <Form.Control let:attrs>
                  <Form.Label>No. Pelacakan</Form.Label>
                  <Input type="date" {...attrs} bind:value={$formData.noPelacakan} />
                </Form.Control>
                <Form.FieldErrors />
              </Form.Field>
              <Form.Field {form} name="jenis">
                <Form.Control let:attrs>
                  <Form.Label>Jenis Pengiriman</Form.Label>
                  <Input type="date" {...attrs} bind:value={$formData.jenis} />
                </Form.Control>
                <Form.FieldErrors />
              </Form.Field>
            </div>
          </div>
          <div>
            <div class="flex w-full flex-col gap-2 py-2">
              <Label>No. Pemesanan</Label>
              <Input readonly value={data.pemesananPembelian?.noPembelian} />
            </div>
            <div class="flex w-full flex-col gap-2 py-2">
              <Label>Tanggal Pemesanan</Label>
              <Input readonly value={data.pemesananPembelian?.tanggal} />
            </div>
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
            {#if data.pemesananPembelian}
              {#each data.pemesananPembelian.produk as item, i (item)}
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
