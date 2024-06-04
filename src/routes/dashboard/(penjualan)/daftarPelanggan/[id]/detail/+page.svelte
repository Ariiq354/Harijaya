<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { ArrowLeft, Loader2 } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { Label } from '$lib/components/ui/label';

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
        <Breadcrumb.Page>Daftar Pelanggan</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1 text-3xl font-bold">Detail Pelanggan</div>
    <Button
      variant="outline"
      href="/dashboard/daftarPelanggan"
      class="p-2 shadow-lg"
      aria-label="go back"
    >
      <ArrowLeft />
    </Button>
  </div>
  <hr class="border-black" />

  <Card.Root class="pt-4">
    <Card.Content>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>Nama Pelanggan</Label>
          <Input disabled value={data.data.name} />
        </div>
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>Email</Label>
          <Input disabled value={data.data.email} />
        </div>
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>NPWP</Label>
          <Input disabled value={data.data.npwp} />
        </div>
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>Phone</Label>
          <Input disabled value={data.data.phone} />
        </div>
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>Address</Label>
          <Textarea rows={6} disabled value={data.data.address} />
        </div>
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>Nama Bank</Label>
          <Input disabled value={data.data.namaBank} />
        </div>
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>No Rekening</Label>
          <Input disabled value={data.data.noRekening} />
        </div>
        <div class="flex w-full flex-col gap-2 py-2">
          <Label>Atas Nama</Label>
          <Input disabled value={data.data.atasNama} />
        </div>
      </div>
    </Card.Content>
  </Card.Root>
</div>
