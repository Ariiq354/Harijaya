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
  let ppnTotal: number;

  const form = superForm(data.form, {
    dataType: 'json',
    validators: zodClient(formSchema),
    async onUpdate({ form }) {
      if (form.valid) {
        toast.success('Submit berhasil');
        await goto('/dashboard/fakturPembelian');
      }
    },
    onError(event) {
      toast.error(event.result.error.message);
    }
  });
  const { form: formData, enhance, submitting } = form;

  function addItem() {
    $formData.produk = [
      ...$formData.produk,
      {
        id: '',
        harga: 0,
        barangId: '',
        kuantitas: 0
      }
    ];
  }

  $: {
    subTotal = $formData.produk.reduce(
      (acc, item) => acc + Number(item.harga) * Number(item.kuantitas),
      0
    );
    ppnTotal = $formData.ppn ? subTotal + subTotal * 0.1 : subTotal;
    $formData.total = ppnTotal + Number($formData.biayaKirim) + Number($formData.biayaLainnya);
  }

  $: selectedSupplier = $formData.supplierId
    ? {
        label: data.supplier.find((i) => i.id == $formData.supplierId)?.name ?? '',
        value: $formData.supplierId
      }
    : undefined;

  $: selectedBarang = $formData.produk.map((p) => {
    const barang = data.barang.find((i) => i.id == p.barangId);
    return barang ? { label: barang.name, value: p.barangId } : undefined;
  });
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
      {#if $formData.id}
        <h1 class="text-3xl font-bold">Edit Faktur Pembelian</h1>
      {:else}
        <h1 class="text-3xl font-bold">Buat Faktur Pembelian</h1>
      {/if}
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

  <SuperDebug data={$formData} />
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
            <Form.Field {form} name="supplierId" class="w-full">
              <Form.Control let:attrs>
                <Form.Label>Nama Supplier</Form.Label>
                <Select.Root
                  selected={selectedSupplier}
                  onSelectedChange={(v) => {
                    v && ($formData.supplierId = v.value);
                  }}
                >
                  <Select.Trigger {...attrs}>
                    <Select.Value placeholder="Pilih supplier..." />
                  </Select.Trigger>
                  <Select.Content class="max-h-40 overflow-auto">
                    {#if data.supplier.length}
                      {#each data.supplier as item}
                        <Select.Item value={item.id} label={item.name} />
                      {/each}
                    {:else}
                      <Select.Item value="" label="No Result Found" disabled />
                    {/if}
                  </Select.Content>
                </Select.Root>
                <input hidden bind:value={$formData.supplierId} name={attrs.name} />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
            <div class="mt-4 flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                readonly
                value={data.supplier.find((i) => i.id == $formData.supplierId)?.email}
              />
            </div>
          </div>
          <div class="flex w-full flex-col gap-2 py-2">
            <Label>Alamat</Label>
            <Textarea
              rows={8}
              readonly
              value={data.supplier.find((i) => i.id == $formData.supplierId)?.address}
            />
          </div>
        </div>
        <hr class="my-4" />
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
              <Form.Label>Tanggal</Form.Label>
              <Input class="block" type="date" {...attrs} bind:value={$formData.tanggal} />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
        </div>
        <hr class="my-4" />
        <div class="flex w-full justify-end">
          <Button on:click={addItem}>Tambah</Button>
        </div>
        <Form.Fieldset {form} name="produk">
          <Table.Root class="w-full">
            <Table.Row>
              <Table.Head>No.</Table.Head>
              <Table.Head>Barang</Table.Head>
              <Table.Head>Harga</Table.Head>
              <Table.Head>Kuantitas</Table.Head>
              <Table.Head>Jumlah</Table.Head>
              <Table.Head>Action</Table.Head>
            </Table.Row>
            {#each $formData.produk as _, i (i)}
              <Table.Row>
                <Table.Cell>
                  {i + 1}
                  <input hidden bind:value={$formData.produk[i].id} name="produk" />
                </Table.Cell>
                <Table.Cell>
                  <Form.ElementField {form} name="produk[{i}].barangId" class="space-y-0">
                    <Form.Control let:attrs>
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
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.ElementField>
                </Table.Cell>
                <Table.Cell>
                  <Input type="number" bind:value={$formData.produk[i].harga} name="produk" />
                </Table.Cell>
                <Table.Cell>
                  <Input type="number" bind:value={$formData.produk[i].kuantitas} name="produk" />
                </Table.Cell>
                <Table.Cell>
                  {$formData.produk[i].harga * $formData.produk[i].kuantitas}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    class="p-2"
                    variant="destructive"
                    on:click={() =>
                      ($formData.produk = $formData.produk.filter((_, ind) => ind !== i))}
                  >
                    <Trash2 />
                  </Button>
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Root>
          <Form.FieldErrors />
        </Form.Fieldset>
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
                <Input
                  readonly
                  value={data.supplier.find((i) => i.id == $formData.supplierId)?.namaBank}
                />
              </div>
              <div class="flex w-full flex-col gap-2 py-2">
                <Label>No. Rekening</Label>
                <Input
                  readonly
                  value={data.supplier.find((i) => i.id == $formData.supplierId)?.noRekening}
                />
              </div>
            </div>
            <div class="flex w-full flex-col gap-2 py-2">
              <Label>Atas Nama</Label>
              <Input
                readonly
                value={data.supplier.find((i) => i.id == $formData.supplierId)?.atasNama}
              />
            </div>
            <ImageUpload
              disabled={false}
              url={$formData.lampiran}
              onChange={(url) => ($formData.lampiran = url)}
              onRemove={() => ($formData.lampiran = '')}
            />
          </div>
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
              <div>Total & PPN:</div>
              <div>
                {ppnTotal}
              </div>
            </div>
            <div class="flex w-full justify-between">
              <div>Biaya Kirim:</div>
              <Form.Field {form} name="biayaKirim">
                <Form.Control let:attrs>
                  <Input type="number" {...attrs} bind:value={$formData.biayaKirim} />
                </Form.Control>
              </Form.Field>
            </div>
            <div class="flex w-full justify-between">
              <div>Biaya Lainnya:</div>
              <Form.Field {form} name="biayaLainnya">
                <Form.Control let:attrs>
                  <Input type="number" {...attrs} bind:value={$formData.biayaLainnya} />
                </Form.Control>
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
