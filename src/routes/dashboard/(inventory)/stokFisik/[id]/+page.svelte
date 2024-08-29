<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import * as Table from '$lib/components/ui/table';
  import { ArrowLeft, Loader2, Trash2 } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import type { PageData } from './$types';
  import { formSchema } from './schema';

  export let data: PageData;

  const form = superForm(data.form, {
    dataType: 'json',
    validators: zodClient(formSchema),
    async onUpdate({ form }) {
      if (form.valid) {
        toast.success('Submit berhasil');
        await goto('/dashboard/stokFisik');
      }
    },
    onError(event) {
      toast.error(event.result.error.message);
    }
  });
  const { form: formData, enhance, submitting } = form;

  function addItem() {
    $formData.produkStok = [
      ...$formData.produkStok,
      {
        id: '',
        barangId: '',
        kuantitas: 0,
        harga: 0,
        tipe: 1
      }
    ];
  }

  $: selectedBarang = $formData.produkStok.map((p) => {
    const barang = data.barang.find((i) => i.id == p.barangId);
    return barang ? { label: barang.name, value: p.barangId } : undefined;
  });

  $: selectedBarangHarga = $formData.produkStok.map((p) => {
    return {
      label: String(p.harga),
      value: p.harga
    };
  });

  $: selectedTipe = $formData.produkStok.map((p) => ({
    label: Number(p.tipe) === 1 ? '-' : '+',
    value: String(p.tipe)
  }));
</script>

<div class="flex flex-col gap-4">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Stok Fisik</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      {#if $formData.id}
        <h1 class="text-3xl font-bold">Edit Stok Fisik</h1>
      {:else}
        <h1 class="text-3xl font-bold">Buat Stok Fisik</h1>
      {/if}
    </div>
    <Button
      variant="outline"
      href="/dashboard/stokFisik"
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
          <Form.Field {form} name="noStokFisik">
            <Form.Control let:attrs>
              <Form.Label>No. Stok Fisik</Form.Label>
              <Input {...attrs} bind:value={$formData.noStokFisik} />
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
        <Form.Fieldset {form} name="produkStok" class="grid grid-cols-1 overflow-auto">
          <Table.Root class="w-full">
            <Table.Row>
              <Table.Head>No.</Table.Head>
              <Table.Head>Barang</Table.Head>
              <Table.Head>Harga</Table.Head>
              <Table.Head>Tipe</Table.Head>
              <Table.Head>Kuantitas</Table.Head>
              <Table.Head>Action</Table.Head>
            </Table.Row>
            {#each $formData.produkStok as _, i (i)}
              <Table.Row>
                <Table.Cell>
                  {i + 1}
                  <input hidden bind:value={$formData.produkStok[i].id} name="produk" />
                </Table.Cell>
                <Table.Cell>
                  <Form.ElementField {form} name="produkStok[{i}].barangId" class="space-y-0">
                    <Form.Control let:attrs>
                      <Select.Root
                        selected={selectedBarang[i]}
                        onSelectedChange={(v) => {
                          v && ($formData.produkStok[i].barangId = v.value);
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
                      <input
                        hidden
                        bind:value={$formData.produkStok[i].barangId}
                        name={attrs.name}
                      />
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.ElementField>
                </Table.Cell>
                <Table.Cell>
                  <Form.ElementField {form} name="produkStok[{i}].harga" class="space-y-0">
                    <Form.Control let:attrs>
                      {#if $formData.produkStok[i].barangId}
                        {@const listHarga = data.barangHarga.filter(
                          (item) => item.barangId === $formData.produkStok[i].barangId
                        )}
                        {#if listHarga.length > 0}
                          <Select.Root
                            selected={selectedBarangHarga[i]}
                            onSelectedChange={(v) => {
                              v && ($formData.produkStok[i].harga = v.value);
                            }}
                          >
                            <Select.Trigger {...attrs}>
                              <Select.Value placeholder="Pilih harga barang..." />
                            </Select.Trigger>
                            <Select.Content class="max-h-40 overflow-auto">
                              {#each listHarga as item}
                                <Select.Item value={item.harga} label={String(item.harga)} />
                              {/each}
                            </Select.Content>
                          </Select.Root>
                        {:else}
                          <Input
                            class="block"
                            type="number"
                            {...attrs}
                            bind:value={$formData.produkStok[i].harga}
                          />
                        {/if}
                      {:else}
                        <Input disabled class="block" type="number" />
                      {/if}
                      <input hidden bind:value={$formData.produkStok[i].harga} name={attrs.name} />
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.ElementField>
                </Table.Cell>
                <Table.Cell>
                  <Select.Root
                    selected={selectedTipe[i]}
                    onSelectedChange={(v) => {
                      v && ($formData.produkStok[i].tipe = Number(v.value));
                    }}
                  >
                    <Select.Trigger name="produk">
                      <Select.Value placeholder="Pilih tipe" />
                    </Select.Trigger>
                    <Select.Content class="max-h-40 overflow-auto">
                      <Select.Item value="1" label="-" />
                      <Select.Item value="2" label="+" />
                    </Select.Content>
                  </Select.Root>
                  <input hidden bind:value={$formData.produkStok[i].tipe} name="produk" />
                </Table.Cell>
                <Table.Cell>
                  <Form.ElementField {form} name="produkStok[{i}].kuantitas" class="space-y-0">
                    <Form.Control let:attrs>
                      <Input
                        class="text-right"
                        type="number"
                        {...attrs}
                        bind:value={$formData.produkStok[i].kuantitas}
                      />
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.ElementField>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    class="p-2"
                    variant="destructive"
                    on:click={() =>
                      ($formData.produkStok = $formData.produkStok.filter((_, ind) => ind !== i))}
                  >
                    <Trash2 />
                  </Button>
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Root>
          <Form.FieldErrors />
        </Form.Fieldset>

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
