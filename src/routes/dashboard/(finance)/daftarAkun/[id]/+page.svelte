<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import * as Select from '$lib/components/ui/select';
  import { Textarea } from '$lib/components/ui/textarea';
  import { ArrowLeft, Loader2 } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import type { PageData } from './$types';
  import { formSchema } from './schema';
  import { tipeAkun } from '$lib/utils';

  export let data: PageData;

  const form = superForm(data.form, {
    dataType: 'json',
    validators: zodClient(formSchema),
    async onUpdate({ form }) {
      if (form.valid) {
        toast.success('Submit berhasil');
        await goto('/dashboard/daftarAkun');
      }
    },
    onError(event) {
      toast.error(event.result.error.message);
    }
  });
  const { form: formData, enhance, submitting } = form;

  $: selectedKategori = $formData.kategori
    ? {
        label: $formData.kategori,
        value: $formData.kategori
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
        <Breadcrumb.Page>Daftar Akun</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      {#if $formData.id}
        <h1 class="text-3xl font-bold">Edit Akun</h1>
      {:else}
        <h1 class="text-3xl font-bold">Buat Akun</h1>
      {/if}
    </div>
    <Button
      variant="outline"
      href="/dashboard/daftarAkun"
      class="p-2 shadow-lg"
      aria-label="go back"
    >
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
        <Form.Field {form} name="kode">
          <Form.Control let:attrs>
            <Form.Label>Kode Akun</Form.Label>
            <Input {...attrs} bind:value={$formData.kode} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="nama">
          <Form.Control let:attrs>
            <Form.Label>Nama Akun</Form.Label>
            <Input {...attrs} bind:value={$formData.nama} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="kategori">
          <Form.Control let:attrs>
            <Form.Label>Kategori</Form.Label>
            <Select.Root
              selected={selectedKategori}
              onSelectedChange={(v) => {
                v && ($formData.kategori = v.value);
              }}
            >
              <Select.Trigger {...attrs}>
                <Select.Value
                  class="capitalize"
                  placeholder="Pilih Kategori Akun"
                  aria-label="Pilih Kategori Akun"
                />
              </Select.Trigger>
              <Select.Content>
                <ScrollArea class="h-40">
                  {#each tipeAkun as item}
                    <Select.Item
                      value={item}
                      label={item.charAt(0).toUpperCase() + item.slice(1)}
                    />
                  {/each}
                </ScrollArea>
              </Select.Content>
            </Select.Root>
            <input hidden bind:value={$formData.kategori} name={attrs.name} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="deskripsi">
          <Form.Control let:attrs>
            <Form.Label>Deskripsi</Form.Label>
            <Textarea {...attrs} bind:value={$formData.deskripsi} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Button disabled={$submitting} class="col-span-2 mt-4" title="submit">
          {#if $submitting}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          {/if}
          Simpan
        </Form.Button>
      </form>
    </Card.Content>
  </Card.Root>
</div>
