<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Input } from '$lib/components/ui/input';
  import * as Table from '$lib/components/ui/table';
  import { ArrowUpDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-svelte';
  import { Render, Subscribe, createTable } from 'svelte-headless-table';
  import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
  import { toast } from 'svelte-sonner';
  import { writable } from 'svelte/store';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import type { PageData } from './$types';
  import { formSchema } from './schema';

  export let data: PageData;

  const tableData = writable(data.utangData);
  $: tableData.set(data.utangData);

  const table = createTable(tableData, {
    page: addPagination({
      initialPageSize: 10
    }),
    sort: addSortBy(),
    filter: addTableFilter({
      fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
    })
  });

  const columns = table.createColumns([
    table.column({
      accessor: ({ fakturPembelian }) => fakturPembelian.noFaktur,
      header: 'No. Faktur'
    }),
    table.column({
      accessor: 'nilai',
      header: 'Nilai Utang',
      cell: ({ value }) => {
        return value.toLocaleString('id-ID');
      }
    }),
    table.column({
      accessor: 'sisa',
      header: 'Sisa',
      cell: ({ value }) => {
        return value.toLocaleString('id-ID');
      }
    })
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
    table.createViewModel(columns);
  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
  const { filterValue } = pluginStates.filter;

  const form = superForm(data.form, {
    dataType: 'json',
    validators: zodClient(formSchema),
    async onUpdate({ form }) {
      if (form.valid) {
        toast.success('Submit berhasil');
        await goto('/dashboard/daftarUtang');
      }
    },
    onError(event) {
      toast.error(event.result.error.message);
    }
  });
  const { form: formData, enhance, submitting } = form;

  function handleChange(status: boolean | string, id: string) {
    if (status) {
      addItem(id);
    } else {
      deleteItem(id);
    }
  }

  $: $formData.total = $formData.utang.reduce((a, i) => a + Number(i.nilai), 0);

  function addItem(id: string) {
    $formData.utang = [
      ...$formData.utang,
      {
        utangId: id,
        nilai: 0
      }
    ];
  }

  function deleteItem(id: string) {
    $formData.utang = $formData.utang.filter((item) => item.utangId !== id);
  }
</script>

<div class="flex flex-col gap-4">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Utang</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Utang</h1>
    </div>
  </div>
  <hr class="border-black" />
  <Card.Root>
    <Card.Content>
      <form method="POST" use:enhance>
        <div>
          <div class="flex items-center py-4">
            <Input class="max-w-sm" placeholder="Cari..." type="text" bind:value={$filterValue} />
          </div>
          <div class="grid grid-cols-1 overflow-auto rounded-md border">
            <Table.Root {...$tableAttrs}>
              <Table.Header>
                {#each $headerRows as headerRow}
                  <Subscribe rowAttrs={headerRow.attrs()}>
                    <Table.Row>
                      <Table.Head>No.</Table.Head>
                      {#each headerRow.cells as cell (cell.id)}
                        <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                          <Table.Head {...attrs} class="last:text-center">
                            {#if cell.id !== 'Action'}
                              <Button
                                variant="ghost"
                                class="hover:bg-background/0 hover:text-foreground"
                                on:click={props.sort.toggle}
                              >
                                <Render of={cell.render()} />
                                <ArrowUpDown class={'ml-2 h-4 w-4'} />
                              </Button>
                            {:else}
                              <Render of={cell.render()} />
                            {/if}
                          </Table.Head>
                        </Subscribe>
                      {/each}
                      <Table.Head>Nilai Pembayaran</Table.Head>
                      <Table.Head>Pilih</Table.Head>
                    </Table.Row>
                  </Subscribe>
                {/each}
              </Table.Header>
              <Table.Body {...$tableBodyAttrs}>
                {#each $pageRows as row, i (row.id)}
                  {@const exist = $formData.utang.findIndex(
                    (item) => item.utangId === data.utangData[i].id
                  )}
                  <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                    <Table.Row {...rowAttrs}>
                      <Table.Cell>{i + 1}</Table.Cell>
                      {#each row.cells as cell (cell.id)}
                        <Subscribe attrs={cell.attrs()} let:attrs>
                          <Table.Cell {...attrs} class="last:text-center">
                            <Render of={cell.render()} />
                          </Table.Cell>
                        </Subscribe>
                      {/each}
                      <Table.Cell>
                        {#if exist >= 0}
                          <Input
                            type="number"
                            min={0}
                            max={data.utangData[exist].sisa}
                            bind:value={$formData.utang[exist].nilai}
                          />
                        {:else}
                          <Input disabled />
                        {/if}
                      </Table.Cell>
                      <Table.Cell>
                        <Checkbox onCheckedChange={(e) => handleChange(e, data.utangData[i].id)} />
                      </Table.Cell>
                    </Table.Row>
                  </Subscribe>
                {/each}
                <Table.Row>
                  <Table.Cell colspan={4} class="text-right">Total:</Table.Cell>
                  <Table.Cell>
                    <input hidden bind:value={$formData.total} type="number" />
                    {$formData.total.toLocaleString('id-ID')}
                  </Table.Cell>
                  <Table.Cell>
                    <Button disabled={$submitting} type="submit" class="">
                      {#if $submitting}
                        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                      {/if}
                      Bayar
                    </Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </div>
          <div class="flex items-center justify-end space-x-4 py-4">
            <Button
              variant="outline"
              size="sm"
              on:click={() => ($pageIndex = $pageIndex - 1)}
              disabled={!$hasPreviousPage}
            >
              <ChevronLeft size="20" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!$hasNextPage}
              on:click={() => ($pageIndex = $pageIndex + 1)}
            >
              <ChevronRight size="20" />
            </Button>
          </div>
        </div>
      </form>
    </Card.Content>
  </Card.Root>
</div>
