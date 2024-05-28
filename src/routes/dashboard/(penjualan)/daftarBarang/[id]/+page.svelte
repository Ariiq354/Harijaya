<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Form from '$lib/components/ui/form';
  import * as Select from '$lib/components/ui/select';
  import { Input } from '$lib/components/ui/input';
  import * as Card from '$lib/components/ui/card';
  import { ArrowLeft, Loader2 } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import type { PageData } from './$types';
  import { formSchema } from './schema';

  export let data: PageData;

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    async onUpdate({ form }) {
      if (form.valid) {
        toast.success('Submit berhasil');
        await goto('/dashboard/daftarBarang');
      }
    },
    onError(event) {
      toast.error(event.result.error.message);
    }
  });
  const { form: formData, enhance, submitting } = form;

  $: selectedSatuan = $formData.satuan
    ? {
        label: $formData.satuan,
        value: $formData.satuan
      }
    : undefined;
</script>

<div class="flex flex-col gap-4">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Daftar Barang</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      {#if $formData.id}
        <h1 class="text-3xl font-bold">Edit Barang</h1>
      {:else}
        <h1 class="text-3xl font-bold">Buat Barang</h1>
      {/if}
    </div>
    <Button variant="outline" href="/dashboard/daftarBarang" class="p-2 shadow-lg">
      <ArrowLeft />
    </Button>
  </div>
  <hr class="border-black" />

  <Card.Root class="pt-4">
    <Card.Content>
      <form method="POST" use:enhance>
        <Form.Field {form} name="id">
          <Form.Control let:attrs>
            <input hidden name={attrs.name} bind:value={$formData.id} />
          </Form.Control>
        </Form.Field>
        <Form.Field {form} name="name">
          <Form.Control let:attrs>
            <Form.Label>Nama Barang</Form.Label>
            <Input {...attrs} bind:value={$formData.name} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="deskripsi">
          <Form.Control let:attrs>
            <Form.Label>Deskripsi</Form.Label>
            <Input type="deskripsi" {...attrs} bind:value={$formData.deskripsi} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="harga">
          <Form.Control let:attrs>
            <Form.Label>Harga / satuan</Form.Label>
            <Input type="number" {...attrs} bind:value={$formData.harga} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="satuan">
          <Form.Control let:attrs>
            <Form.Label>Satuan</Form.Label>
            <Select.Root
              selected={selectedSatuan}
              onSelectedChange={(v) => {
                v && ($formData.satuan = v.value);
              }}
            >
              <Select.Trigger {...attrs}>
                <Select.Value placeholder="Select satuan" />
              </Select.Trigger>
              <Select.Content class="max-h-40 overflow-auto">
                <Select.Item value="1 Unit" label="1 Unit" />
                <Select.Item value="100 Roll / Pack" label="100 Roll / Pack" />
                <Select.Item value="25 Cards" label="25 Cards" />
                <Select.Item value="Bag" label="Bag" />
                <Select.Item value="Botol" label="Botol" />
                <Select.Item value="Box" label="Box" />
                <Select.Item value="Buah" label="Buah" />
                <Select.Item value="Cost/Test" label="Cost/Test" />
                <Select.Item value="Electrolyte Analyzer" label="Electrolyte Analyzer" />
                <Select.Item value="Galon" label="Galon" />
                <Select.Item value="Kit" label="Kit" />
                <Select.Item value="Pcs" label="Pcs" />
                <Select.Item value="Per Petri" label="Per Petri" />
                <Select.Item value="Pouch" label="Pouch" />
                <Select.Item value="Set" label="Set" />
                <Select.Item value="String" label="String" />
                <Select.Item value="Tube" label="Tube" />
                <Select.Item value="Unit" label="Unit" />
                <Select.Item value="Urine Analyzer" label="Urine Analyzer" />
                <Select.Item value="Vial" label="Vial" />
                <Select.Item value="Vil" label="Vil" />
                <Select.Item value="Roll" label="Roll" />
              </Select.Content>
            </Select.Root>
            <input hidden bind:value={$formData.satuan} name={attrs.name} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Button disabled={$submitting} class="col-span-2 mt-4">
          {#if $submitting}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          {/if}
          Simpan
        </Form.Button>
      </form>
    </Card.Content>
  </Card.Root>
</div>
