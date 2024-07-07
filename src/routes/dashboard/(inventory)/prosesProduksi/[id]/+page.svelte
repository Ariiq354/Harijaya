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
        await goto('/dashboard/prosesProduksi');
      }
    },
    onError(event) {
      toast.error(event.result.error.message);
    }
  });
  const { form: formData, enhance, submitting } = form;
  $formData.noProses = data.trx;
  $formData.bahanMentah = data.itemBahanMentah ? data.itemBahanMentah : [];
  $formData.barangJadi = data.itemBarangJadi ? data.itemBarangJadi : [];

  function addBahanMentah() {
    $formData.bahanMentah = [
      ...$formData.bahanMentah,
      {
        id: '',
        barangId: '',
        kuantitas: 0,
        tipeBarang: 1
      }
    ];
  }

  function addBarangJadi() {
    $formData.barangJadi = [
      ...$formData.barangJadi,
      {
        id: '',
        barangId: '',
        kuantitas: 0,
        tipeBarang: 2
      }
    ];
  }

  $: selectedBahanMentah = $formData.bahanMentah.map((p) => {
    const barang = data.bahanMentah.find((i) => i.id == p.barangId);
    return barang ? { label: barang.name, value: p.barangId } : undefined;
  });

  $: selectedBarangJadi = $formData.barangJadi.map((p) => {
    const barang = data.barangJadi.find((i) => i.id == p.barangId);
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
        <Breadcrumb.Page>Proses Produksi</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      {#if $formData.id}
        <h1 class="text-3xl font-bold">Edit Proses Produksi</h1>
      {:else}
        <h1 class="text-3xl font-bold">Buat Proses Produksi</h1>
      {/if}
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
      <form method="POST" use:enhance class="w-full">
        <Form.Field {form} name="id" class="hidden">
          <Form.Control let:attrs>
            <input hidden name={attrs.name} bind:value={$formData.id} />
          </Form.Control>
        </Form.Field>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Field {form} name="noProses">
            <Form.Control let:attrs>
              <Form.Label>No. Proses</Form.Label>
              <Input readonly {...attrs} bind:value={$formData.noProses} />
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
          <Button on:click={addBahanMentah}>Tambah</Button>
        </div>
        <Form.Fieldset {form} name="bahanMentah" class="grid grid-cols-1 overflow-auto">
          <Form.Legend>List Bahan Mentah</Form.Legend>
          <Table.Root class="w-full">
            <Table.Row>
              <Table.Head>No.</Table.Head>
              <Table.Head>Barang</Table.Head>
              <Table.Head>Satuan</Table.Head>
              <Table.Head>Kuantitas</Table.Head>
              <Table.Head>Action</Table.Head>
            </Table.Row>
            {#each $formData.bahanMentah as _, i (i)}
              {@const barang = data.bahanMentah.find(
                (item) => item.id === $formData.bahanMentah[i].barangId
              )}
              <Table.Row>
                <Table.Cell>
                  {i + 1}
                  <input hidden bind:value={$formData.bahanMentah[i].id} name="bahanMentah" />
                </Table.Cell>
                <Table.Cell>
                  <Form.ElementField {form} name="bahanMentah[{i}].barangId" class="space-y-0">
                    <Form.Control let:attrs>
                      <Select.Root
                        selected={selectedBahanMentah[i]}
                        onSelectedChange={(v) => {
                          v && ($formData.bahanMentah[i].barangId = v.value);
                        }}
                      >
                        <Select.Trigger {...attrs}>
                          <Select.Value placeholder="Pilih barang..." />
                        </Select.Trigger>
                        <Select.Content class="max-h-40 overflow-auto">
                          {#if data.bahanMentah.length}
                            {#each data.bahanMentah as item}
                              <Select.Item value={item.id} label={item.name} />
                            {/each}
                          {:else}
                            <Select.Item value="" label="No Result Found" disabled />
                          {/if}
                        </Select.Content>
                      </Select.Root>
                      <input
                        hidden
                        bind:value={$formData.bahanMentah[i].barangId}
                        name={attrs.name}
                      />
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.ElementField>
                </Table.Cell>
                <Table.Cell>
                  {barang ? barang.satuan : 'Kosong'}
                </Table.Cell>
                <Table.Cell>
                  <Form.ElementField {form} name="bahanMentah[{i}].kuantitas" class="space-y-0">
                    <Form.Control let:attrs>
                      <Input
                        class="text-right"
                        type="number"
                        {...attrs}
                        bind:value={$formData.bahanMentah[i].kuantitas}
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
                      ($formData.bahanMentah = $formData.bahanMentah.filter((_, ind) => ind !== i))}
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
        <div class="flex w-full justify-end">
          <Button on:click={addBarangJadi}>Tambah</Button>
        </div>
        <Form.Fieldset {form} name="barangJadi" class="grid w-full grid-cols-1 overflow-auto">
          <Form.Legend>List Barang Jadi</Form.Legend>
          <Table.Root class="w-full">
            <Table.Row>
              <Table.Head>No.</Table.Head>
              <Table.Head>Barang</Table.Head>
              <Table.Head>Satuan</Table.Head>
              <Table.Head>Kuantitas</Table.Head>
              <Table.Head>Action</Table.Head>
            </Table.Row>
            {#each $formData.barangJadi as _, i (i)}
              {@const barang = data.barangJadi.find(
                (item) => item.id === $formData.barangJadi[i].barangId
              )}
              <Table.Row>
                <Table.Cell>
                  {i + 1}
                  <input hidden bind:value={$formData.barangJadi[i].id} name="barangJadi" />
                </Table.Cell>
                <Table.Cell>
                  <Form.ElementField {form} name="barangJadi[{i}].barangId" class="space-y-0">
                    <Form.Control let:attrs>
                      <Select.Root
                        selected={selectedBarangJadi[i]}
                        onSelectedChange={(v) => {
                          v && ($formData.barangJadi[i].barangId = v.value);
                        }}
                      >
                        <Select.Trigger {...attrs}>
                          <Select.Value placeholder="Pilih barang..." />
                        </Select.Trigger>
                        <Select.Content class="max-h-40 overflow-auto">
                          {#if data.barangJadi.length}
                            {#each data.barangJadi as item}
                              <Select.Item value={item.id} label={item.name} />
                            {/each}
                          {:else}
                            <Select.Item value="" label="No Result Found" disabled />
                          {/if}
                        </Select.Content>
                      </Select.Root>
                      <input
                        hidden
                        bind:value={$formData.barangJadi[i].barangId}
                        name={attrs.name}
                      />
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.ElementField>
                </Table.Cell>
                <Table.Cell>
                  {barang ? barang.satuan : 'Kosong'}
                </Table.Cell>
                <Table.Cell>
                  <Form.ElementField {form} name="barangJadi[{i}].kuantitas" class="space-y-0">
                    <Form.Control let:attrs>
                      <Input
                        class="text-right"
                        type="number"
                        {...attrs}
                        bind:value={$formData.barangJadi[i].kuantitas}
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
                      ($formData.barangJadi = $formData.barangJadi.filter((_, ind) => ind !== i))}
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
