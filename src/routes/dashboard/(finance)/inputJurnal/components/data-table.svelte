<script lang="ts">
  import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
  import { writable } from 'svelte/store';
  import type { selectJurnal, selectAkun } from '$lib/server/schema/keuangan';
  import * as Table from '$lib/components/ui/table';
  import DataTableActions from './data-table-action.svelte';
  import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import DataTableRenderNama from './data-table-render-nama.svelte';

  type customType = selectJurnal & {
    akunDebit: selectAkun | null;
    akunKredit: selectAkun | null;
  };

  export let data: customType[];

  const tableData = writable(data);
  $: tableData.set(data);

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
      accessor: 'kodeTransaksi',
      header: 'Kode Transaksi'
    }),
    table.column({
      accessor: 'tanggal',
      header: 'Tgl. Transaksi'
    }),
    table.column({
      accessor: ({ akunDebit, akunKredit }) => ({
        akunDebit,
        akunKredit
      }),
      header: 'Nama Akun',
      cell: ({ value }) => {
        if (!value.akunDebit || !value.akunKredit) {
          return 'Akun tidak ada';
        } else {
          return createRender(DataTableRenderNama, {
            akunDebit: value.akunDebit,
            akunKredit: value.akunKredit
          });
        }
      }
    }),
    table.column({
      accessor: 'nominal',
      header: 'Nominal'
    }),
    table.column({
      accessor: 'deskripsi',
      header: 'Deskripsi'
    }),
    table.column({
      accessor: ({ id }) => id,
      header: 'Action',
      cell: ({ value }) => {
        return createRender(DataTableActions, { id: value });
      },
      plugins: {
        sort: {
          disable: true
        },

        filter: {
          exclude: true
        }
      }
    })
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
    table.createViewModel(columns);
  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
  const { filterValue } = pluginStates.filter;
</script>

<div>
  <div class="flex items-center py-4">
    <Input class="max-w-sm" placeholder="Cari..." type="text" bind:value={$filterValue} />
  </div>
  <div class="rounded-md border">
    <Table.Root {...$tableAttrs}>
      <Table.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row>
              <Table.Head>No.</Table.Head>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                  <Table.Head {...attrs} class="text-center">
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
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Header>
      <Table.Body {...$tableBodyAttrs}>
        {#each $pageRows as row, i (row.id)}
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
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
  <div class="flex items-center justify-end space-x-4 py-4">
    <Button
      variant="outline"
      size="sm"
      on:click={() => ($pageIndex = $pageIndex - 1)}
      disabled={!$hasPreviousPage}
      title="previous data"
    >
      <ChevronLeft size="20" />
    </Button>
    <Button
      variant="outline"
      size="sm"
      disabled={!$hasNextPage}
      on:click={() => ($pageIndex = $pageIndex + 1)}
      title="next data"
    >
      <ChevronRight size="20" />
    </Button>
  </div>
</div>
