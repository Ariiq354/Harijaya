<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import Label from '$lib/components/ui/label/label.svelte';
  import { ArrowLeft } from 'lucide-svelte';
  import type { PageData } from './$types';

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
        <Breadcrumb.Page>Input Jurnal</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1 text-3xl font-bold">Detail Jurnal</div>
    <Button
      variant="outline"
      href="/dashboard/inputJurnal"
      class="p-2 shadow-lg"
      aria-label="go back"
    >
      <ArrowLeft />
    </Button>
  </div>
  <hr class="border-black" />

  <Card.Root class="pt-4">
    <Card.Content>
      <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>Kode Transaksi</Label>
          <Input disabled value={data.data.kodeTransaksi} />
        </div>
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>Nominal</Label>
          <Input class="text-right" disabled value={data.data.nominal.toLocaleString('id-ID')} />
        </div>
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>Akun</Label>
          {#if data.data.akun}
            <Input disabled value={data.data.akun.nama} />
          {:else}
            <Input disabled value="Akun tidak ada" />
          {/if}
        </div>
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>Tgl. Transaksi</Label>
          <Input disabled value={data.data.tanggal} />
        </div>
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>No. Referensi</Label>
          <Input disabled value={data.data.noReferensi} />
        </div>
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>Deskripsi</Label>
          <Input disabled value={data.data.deskripsi} />
        </div>
      </div>
    </Card.Content>
  </Card.Root>
</div>
