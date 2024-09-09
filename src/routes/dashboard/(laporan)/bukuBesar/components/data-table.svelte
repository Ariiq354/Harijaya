<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import * as Table from '$lib/components/ui/table';
  import type { tableJurnalType } from '$lib/server/data-access/keuangan/jurnal';
  import type { Akun } from '$lib/server/database/schema/keuangan';
  import type { Barang, BarangHarga } from '$lib/server/database/schema/penjualan';
  import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { Render, Subscribe, createTable } from 'svelte-headless-table';
  import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
  import { writable } from 'svelte/store';

  type customType = {
    jurnalData: tableJurnalType[];
    akun: {
      id: string;
      createdAt: string | null;
      updatedAt: string | null;
      deskripsi: string;
      kode: string;
      nama: string;
      kategori: string;
    }[];
    totalAwal: string | number;
    totalAkhir: string | number;
  };

  export let data: customType;

  //   export let saldoAwal: string | number;
  //   export let saldoAkhir: string | number;

  const tableData = writable(data.jurnalData);
  $: tableData.set(data.jurnalData);

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
      accessor: 'deskripsi',
      header: 'Description',
      cell: ({ value }) => {
        if (value) {
          return value;
        } else {
          return 'No Description';
        }
      }
    }),
    table.column({
      accessor: 'created_at',
      header: 'Date',
      cell: ({ value }) => {
        if (value) {
          return value.slice(0, 10);
        } else {
          return 'No Date';
        }
      }
    }),
    table.column({
      accessor: 'kode_transaksi',
      header: 'Code'
    }),
    table.column({
      accessor: ({ nominal }) => nominal,
      header: 'Debit',
      cell: ({ value }) => {
        if (value > 0) {
          return value.toLocaleString('id-ID');
        } else {
          return 0;
        }
      }
    }),
    table.column({
      accessor: ({ nominal }) => nominal,
      header: 'Kredit',
      cell: ({ value }) => {
        if (value < 0) {
          return value.toLocaleString('id-ID');
        } else {
          return 0;
        }
      }
    }),
    table.column({
      accessor: ({ nominal }) => nominal,
      header: 'Balance'
    })
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
    table.createViewModel(columns);
  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
</script>

<div>
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
        <!-- Saldo Awal Row -->
        <Table.Row>
          <Table.Cell>Saldo Awal</Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell>{data.totalAwal}</Table.Cell>
          <!-- Display Saldo Awal in Balance Column -->
        </Table.Row>

        <!-- Dynamic Rows for Jurnal Data -->
        {#each $pageRows as row, i (row.id)}
          <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
            <Table.Row {...rowAttrs}>
              <Table.Cell>{i + 1}</Table.Cell>
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <Table.Cell {...attrs}>
                    <!-- Render all other cells except the Balance column -->
                    {#if cell.id === 'Balance'}
                      <!-- Keep Balance column empty for all rows -->
                      <span></span>
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
                  </Table.Cell>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}

        <!-- Saldo Akhir Row -->
        <Table.Row>
          <Table.Cell>Saldo Akhir</Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell>{data.totalAkhir}</Table.Cell>
          <!-- Display Saldo Akhir in Balance Column -->
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
