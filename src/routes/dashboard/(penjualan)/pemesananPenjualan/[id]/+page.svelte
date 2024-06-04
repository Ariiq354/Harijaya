<script lang="ts">
  import { goto } from '$app/navigation';
  import ImageUpload from '$lib/components/ImageUpload.svelte';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Select from '$lib/components/ui/select';
  import * as Table from '$lib/components/ui/table';
  import { Textarea } from '$lib/components/ui/textarea';
  import { ArrowLeft, Loader2, Trash2 } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import SuperDebug, { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import type { PageData } from './$types';
  import { formSchema } from './schema';

  export let data: PageData;
  let subTotal: number;

  const form = superForm(data.form, {
    dataType: 'json',
    validators: zodClient(formSchema),
    async onUpdate({ form }) {
      if (form.valid) {
        toast.success('Submit berhasil');
        await goto('/dashboard/pemesananPenjualan');
      }
    },
    onError(event) {
      toast.error(event.result.error.message);
    }
  });
  const { form: formData, enhance, submitting } = form;
  $formData.noPenjualan = data.trx;

  function tambahData() {
    $formData.produk = [
      ...$formData.produk,
      {
        id: '',
        barangId: '',
        kuantitas: 0
      }
    ];
  }

  function removeData(i: number) {
    $formData.produk.splice(i, 1);
    $formData.produk = $formData.produk;
  }

  $: {
    subTotal = $formData.produk.reduce((acc, item) => {
      const barang = data.barang.find((product) => product.id === item.barangId);
      if (barang) {
        acc += barang.harga * item.kuantitas;
      }
      return acc;
    }, 0);
    $formData.total = $formData.ppn
      ? subTotal + subTotal * 0.1 + Number($formData.pembulatan)
      : subTotal + Number($formData.pembulatan);
  }

  $: selectedPelanggan = $formData.pelangganId
    ? {
        label: data.pelanggan.find((i) => i.id == $formData.pelangganId)?.name,
        value: $formData.pelangganId
      }
    : undefined;

  $: selectedBarang = $formData.produk
    .map((p) => {
      const barang = data.barang.find((i) => i.id == p.barangId);
      return barang ? { label: barang.name, value: p.barangId } : undefined;
    })
    .filter(Boolean);
</script>

<div class="flex flex-col gap-4">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Pemesanan Penjualan</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      {#if $formData.id}
        <h1 class="text-3xl font-bold">Edit Pemesanan Penjualan</h1>
      {:else}
        <h1 class="text-3xl font-bold">Buat Pemesanan Penjualan</h1>
      {/if}
    </div>
    <Button
      variant="outline"
      href="/dashboard/pemesananPenjualan"
      class="p-2 shadow-lg"
      aria-label="go back"
    >
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
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Form.Field {form} name="pelangganId" class="w-full">
              <Form.Control let:attrs>
                <Form.Label>Nama Pelanggan</Form.Label>
                <Select.Root
                  selected={selectedPelanggan}
                  onSelectedChange={(v) => {
                    v && ($formData.pelangganId = v.value);
                  }}
                >
                  <Select.Trigger {...attrs}>
                    <Select.Value placeholder="Pilih pelanggan..." />
                  </Select.Trigger>
                  <Select.Content class="max-h-40 overflow-auto">
                    {#if data.pelanggan.length}
                      {#each data.pelanggan as item}
                        <Select.Item value={item.id} label={item.name} />
                      {/each}
                    {:else}
                      <Select.Item value="" label="No Result Found" disabled />
                    {/if}
                  </Select.Content>
                </Select.Root>
                <input hidden bind:value={$formData.pelangganId} name={attrs.name} />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
            <div class="mt-4 flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                readonly
                value={data.pelanggan.find((i) => i.id == $formData.pelangganId)?.email}
              />
            </div>
          </div>
          <div class="flex w-full flex-col gap-2 py-2">
            <Label>Alamat</Label>
            <Textarea
              rows={8}
              readonly
              value={data.pelanggan.find((i) => i.id == $formData.pelangganId)?.address}
            />
          </div>
        </div>
        <hr class="my-4" />
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Field {form} name="noPenjualan">
            <Form.Control let:attrs>
              <Form.Label>No. Penjualan</Form.Label>
              <Input readonly {...attrs} bind:value={$formData.noPenjualan} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <Form.Field {form} name="tanggal">
            <Form.Control let:attrs>
              <Form.Label>Tanggal</Form.Label>
              <Input class="block" type="date" {...attrs} bind:value={$formData.tanggal} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </div>
        <hr class="my-4" />
        <div class="flex w-full justify-end">
          <Button on:click={tambahData}>Tambah</Button>
        </div>
        <Form.Field {form} name="produk">
          <Table.Root class="w-full">
            <Table.Header>
              <Table.Row>
                <Table.Head>No.</Table.Head>
                <Table.Head>Barang</Table.Head>
                <Table.Head>Harga</Table.Head>
                <Table.Head>Kuantitas</Table.Head>
                <Table.Head>Jumlah</Table.Head>
                <Table.Head>Action</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each $formData.produk as item, i (item)}
                {@const harga = data.barang.find((i) => i.id == item.barangId)?.harga}
                <Table.Row>
                  <Form.Control let:attrs>
                    <Table.Cell>{i + 1}</Table.Cell>
                    <Table.Cell>
                      <Select.Root
                        selected={selectedBarang[i]}
                        onSelectedChange={(v) => {
                          v && ($formData.produk[i].barangId = v.value);
                        }}
                      >
                        <Select.Trigger {...attrs}>
                          <Select.Value placeholder="Pilih barang..." />
                        </Select.Trigger>
                        <Select.Content class="max-h-40 overflow-auto">
                          {#if data.barang.length}
                            {#each data.barang as item}
                              <Select.Item value={item.id} label={item.name} />
                            {/each}
                          {:else}
                            <Select.Item value="" label="No Result Found" disabled />
                          {/if}
                        </Select.Content>
                      </Select.Root>
                      <input hidden bind:value={$formData.produk[i].barangId} name={attrs.name} />
                      <input hidden bind:value={$formData.produk[i].id} name={attrs.name} />
                    </Table.Cell>
                    <Table.Cell>
                      {#if harga}
                        {Math.round(harga)}
                      {:else}
                        0
                      {/if}
                    </Table.Cell>
                    <Table.Cell>
                      <Input type="number" bind:value={$formData.produk[i].kuantitas} />
                    </Table.Cell>
                    <Table.Cell>
                      {#if harga}
                        {harga * $formData.produk[i].kuantitas}
                      {:else}
                        0
                      {/if}
                    </Table.Cell>
                    <Table.Cell>
                      <Button class="p-2" variant="destructive" on:click={() => removeData(i)}>
                        <Trash2 />
                      </Button>
                    </Table.Cell>
                  </Form.Control>
                </Table.Row>
              {/each}
            </Table.Body>
          </Table.Root>
        </Form.Field>
        <hr class="my-4" />
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ImageUpload
            disabled={false}
            url={$formData.lampiran}
            onChange={(url) => ($formData.lampiran = url)}
            onRemove={() => ($formData.lampiran = '')}
          />
          <div class="flex flex-col gap-2">
            <div class="flex w-full justify-between">
              <div>Subtotal:</div>
              <div>
                {subTotal}
              </div>
            </div>
            <div class="flex w-full justify-between">
              <div>PPN:</div>
              <Form.Field {form} name="ppn">
                <Form.Control let:attrs>
                  <Checkbox {...attrs} bind:checked={$formData.ppn} />
                  <input name={attrs.name} value={$formData.ppn} hidden />
                </Form.Control>
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
                <input type="hidden" bind:value={$formData.total} />
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
