<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as Table from '$lib/components/ui/table';
  import { ArrowLeft, Loader2 } from 'lucide-svelte';
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
        await goto('/dashboard/pembayaranUtang');
      }
    },
    onError(event) {
      toast.error(event.result.error.message);
    }
  });
  const { form: formData, enhance, submitting } = form;

  $: $formData.totalNilai = $formData.utangItem.reduce((a, i) => a + Number(i.nilai), 0);
</script>

<div class="flex flex-col gap-4">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Pembayaran Utang</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Edit Pembayaran Utang</h1>
    </div>
    <Button
      variant="outline"
      href="/dashboard/pembayaranUtang"
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
          <Form.Field {form} name="noTransaksi">
            <Form.Control let:attrs>
              <Form.Label>No. Pembayaran</Form.Label>
              <Input readonly {...attrs} bind:value={$formData.noTransaksi} />
            </Form.Control>
          </Form.Field>
          <div>
            <Form.Field {form} name="noTransaksi">
              <Form.Control let:attrs>
                <Form.Label>Total Nilai</Form.Label>
                <Input readonly {...attrs} value={$formData.totalNilai} />
              </Form.Control>
            </Form.Field>
          </div>
        </div>
        <hr class="my-4" />
        <Form.Fieldset {form} name="utangItem">
          <Table.Root class="w-full">
            <Table.Row>
              <Table.Head>No.</Table.Head>
              <Table.Head>No Faktur</Table.Head>
              <Table.Head>Nilai</Table.Head>
            </Table.Row>
            {#each $formData.utangItem as item, i (i)}
              {@const utang = data.utang.find((utang) => utang.id === item.noUtang)}
              <Table.Row>
                <Table.Cell>
                  {i + 1}
                  <input hidden bind:value={$formData.utangItem[i].id} name="utang" />
                </Table.Cell>
                <Table.Cell>
                  {utang?.fakturPembelian.noFaktur}
                </Table.Cell>
                <Table.Cell>
                  <Form.ElementField {form} name="utangItem[{i}].nilai" class="space-y-0">
                    <Form.Control let:attrs>
                      <Input
                        type="number"
                        min={0}
                        max={data.form.data.utangItem[i].nilai + (utang?.sisa ?? 0)}
                        {...attrs}
                        bind:value={$formData.utangItem[i].nilai}
                      />
                    </Form.Control>
                    <Form.FieldErrors />
                  </Form.ElementField>
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Root>
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
