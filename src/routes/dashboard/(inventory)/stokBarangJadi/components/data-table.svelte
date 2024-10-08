<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Table from '$lib/components/ui/table';
  import type { Barang, BarangHarga } from '$lib/server/database/schema/penjualan';
  import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { Render, Subscribe, createTable } from 'svelte-headless-table';
  import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
  import { writable } from 'svelte/store';

  type selectType = {
    barang: Barang | null;
    barang_harga: BarangHarga;
  };

  export let data: selectType[];

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
      accessor: ({ barang }) => barang,
      header: 'Nama Barang',
      cell: ({ value }) => {
        return value!.name;
      }
    }),
    table.column({
      accessor: ({ barang_harga }) => barang_harga.harga,
      header: 'Harga Barang',
      cell: ({ value }) => {
        return value.toLocaleString('id-ID');
      }
    }),
    table.column({
      accessor: ({ barang_harga }) => barang_harga.stok,
      header: 'Stok',
      cell: ({ value }) => {
        return value.toLocaleString('id-ID');
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
                  <Table.Cell {...attrs} class="number-3 last:text-center">
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
