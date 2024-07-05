<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as Card from '$lib/components/ui/card';
  import { ArrowLeft, Loader2 } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import type { PageData } from './$types';
  import { formSchema } from './schema';
  import { Textarea } from '$lib/components/ui/textarea';

  export let data: PageData;

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    async onUpdate({ form }) {
      if (form.valid) {
        toast.success('Submit berhasil');
        await goto('/dashboard/daftarPemasok');
      }
    },
    onError(event) {
      toast.error(event.result.error.message);
    }
  });
  const { form: formData, enhance, submitting } = form;
</script>

<div class="flex flex-col gap-4">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Daftar Supplier</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      {#if $formData.id}
        <h1 class="text-3xl font-bold">Edit Supplier</h1>
      {:else}
        <h1 class="text-3xl font-bold">Buat Supplier</h1>
      {/if}
    </div>
    <Button variant="outline" href="/dashboard/daftarPemasok" class="p-2 shadow-lg">
      <ArrowLeft />
    </Button>
  </div>
  <hr class="border-black" />

  <Card.Root class="pt-4">
    <Card.Content>
      <form method="POST" use:enhance class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Form.Field {form} name="id" class="hidden">
          <Form.Control let:attrs>
            <input hidden name={attrs.name} bind:value={$formData.id} />
          </Form.Control>
        </Form.Field>
        <Form.Field {form} name="name">
          <Form.Control let:attrs>
            <Form.Label>Nama Supplier</Form.Label>
            <Input {...attrs} bind:value={$formData.name} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="npwp">
          <Form.Control let:attrs>
            <Form.Label>NPWP</Form.Label>
            <Input {...attrs} bind:value={$formData.npwp} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="email">
          <Form.Control let:attrs>
            <Form.Label>Email</Form.Label>
            <Input type="email" {...attrs} bind:value={$formData.email} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="phone">
          <Form.Control let:attrs>
            <Form.Label>Phone</Form.Label>
            <Input {...attrs} bind:value={$formData.phone} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="address">
          <Form.Control let:attrs>
            <Form.Label>Address</Form.Label>
            <Textarea rows={6} {...attrs} bind:value={$formData.address} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="noRekening">
          <Form.Control let:attrs>
            <Form.Label>No. Rekening</Form.Label>
            <Input {...attrs} bind:value={$formData.noRekening} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="namaBank">
          <Form.Control let:attrs>
            <Form.Label>Nama Bank</Form.Label>
            <Input {...attrs} bind:value={$formData.namaBank} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="atasNama">
          <Form.Control let:attrs>
            <Form.Label>Atas Nama</Form.Label>
            <Input {...attrs} bind:value={$formData.atasNama} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Button disabled={$submitting} class="mt-4 w-fit md:col-span-2">
          {#if $submitting}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          {/if}
          Simpan
        </Form.Button>
      </form>
    </Card.Content>
  </Card.Root>
</div>
