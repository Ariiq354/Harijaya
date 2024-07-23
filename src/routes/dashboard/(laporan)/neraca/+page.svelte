<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Plus } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { getDashedDate, tipeAkun } from '$lib/utils';

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
        <Breadcrumb.Page>Neraca</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Neraca</h1>
    </div>
  </div>
  <hr class="border-black" />
  <div class="rounded-lg border-2 bg-white px-12 py-4">
    <div class="mb-12 w-full">
      <div class="border-b-2 p-2 text-center">
        <h1 class="text-2xl font-bold">PT. Harijaya Fillet & Grill</h1>
        <p class="text-xl font-semibold text-black/80">Statement of Financial Position</p>
        <p class="text-black/80">{getDashedDate()}</p>
      </div>
    </div>
    <table class="w-full">
      {#each tipeAkun as item}
        {@const daftarAkun = data.data.filter((i) => i.kategori === item)}
        <tr class="border-b-2 odd:bg-gray-100">
          <td colspan="2" class="p-2 font-semibold"
            >{item.charAt(0).toUpperCase() + item.slice(1)}</td
          >
        </tr>
        {#each daftarAkun as akun}
          <tr class="border-b-2 odd:bg-gray-100">
            <td class="p-2 indent-10">{akun.nama}</td>
            <td>0</td>
          </tr>
        {/each}
      {/each}
    </table>
  </div>
</div>
