<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Plus } from 'lucide-svelte';
  import * as Select from '$lib/components/ui/select';
  import type { PageData } from './$types';
  import DataTable from './components/data-table.svelte';

  export let data: PageData;
</script>

<div class="flex flex-col gap-4">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/dashboard">Dashboard</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Page>Buku Besar</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Buku Besar</h1>
    </div>
  </div>
  <hr class="border-black" />
  <Card.Root>
    <Card.Content>
      <Select.Root
        selected={selectedAkun}
        onSelectedChange={(v) => {
          v && ($formData.noAkun = v.value);
        }}
      >
        <Select.Trigger id="noAkun">
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
      <DataTable data={data.jurnalData} />
    </Card.Content>
  </Card.Root>
</div>
