<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
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
        await goto('/dashboard/inputJurnal');
      }
    },
    onError(event) {
      toast.error(event.result.error.message);
    }
  });
  const { form: formData, enhance, submitting } = form;
  $formData.kodeTransaksi = data.trx;

  $: selectedAkun = $formData.noAkun
    ? {
        label: data.akun.find((i) => i.kode == $formData.noAkun)?.nama,
        value: $formData.noAkun
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
        <Breadcrumb.Page>Daftar Jurnal</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      {#if $formData.id}
        <h1 class="text-3xl font-bold">Edit Jurnal</h1>
      {:else}
        <h1 class="text-3xl font-bold">Buat Jurnal</h1>
      {/if}
    </div>
    <Button variant="outline" href="/dashboard/inputJurnal" class="p-2 shadow-lg" title="go back">
      <ArrowLeft />
    </Button>
  </div>
  <hr class="border-black" />

  <Card.Root class="pt-4">
    <Card.Content>
      <form method="POST" use:enhance class="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Form.Field {form} name="id" class="hidden">
          <Form.Control let:attrs>
            <input name={attrs.name} bind:value={$formData.id} />
          </Form.Control>
        </Form.Field>
        <Form.Field {form} name="kodeTransaksi">
          <Form.Control let:attrs>
            <Form.Label>Kode Transaksi</Form.Label>
            <Input readonly {...attrs} bind:value={$formData.kodeTransaksi} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="nominal">
          <Form.Control let:attrs>
            <Form.Label>Nominal</Form.Label>
            <Input
              type="number"
              {...attrs}
              bind:value={$formData.nominal}
              class="text-right"
              placeholder="Rp"
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="noAkun">
          <Form.Control let:attrs>
            <Form.Label>Akun</Form.Label>
            <Select.Root
              selected={selectedAkun}
              onSelectedChange={(v) => {
                v && ($formData.noAkun = v.value);
              }}
            >
              <Select.Trigger {...attrs}>
                <Select.Value class="capitalize" placeholder="Pilih Akun" />
              </Select.Trigger>
              <Select.Content class="max-h-40 overflow-auto">
                {#if data.akun.length}
                  {#each data.akun as item}
                    <Select.Item value={item.kode} label={item.nama} />
                  {/each}
                {:else}
                  <Select.Item disabled value="" label="No Result Found" />
                {/if}
              </Select.Content>
            </Select.Root>
            <input hidden bind:value={$formData.noAkun} name={attrs.name} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="tanggal">
          <Form.Control let:attrs>
            <Form.Label>Tgl. Transaksi</Form.Label>
            <Input class="block" type="date" {...attrs} bind:value={$formData.tanggal} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="noReferensi">
          <Form.Control let:attrs>
            <Form.Label>No. Referensi</Form.Label>
            <Input {...attrs} bind:value={$formData.noReferensi} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="deskripsi">
          <Form.Control let:attrs>
            <Form.Label>Deskripsi</Form.Label>
            <Input {...attrs} bind:value={$formData.deskripsi} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Button disabled={$submitting} class="mt-4 w-fit md:col-span-2" title="submit form">
          {#if $submitting}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          {/if}
          Simpan
        </Form.Button>
      </form>
    </Card.Content>
  </Card.Root>
</div>
