<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
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
        <Breadcrumb.Page>Daftar Akun</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1 text-3xl font-bold">Detail Akun</div>
    <Button
      variant="outline"
      href="/dashboard/daftarAkun"
      class="p-2 shadow-lg"
      aria-label="go back"
    >
      <ArrowLeft />
    </Button>
  </div>
  <hr class="border-black" />

  <Card.Root class="pt-4">
    <Card.Content>
      <div class="flex w-full flex-col gap-2 py-2">
        <Label>Kode Akun</Label>
        <Input disabled value={data.data.kode} />
      </div>
      <div class="flex w-full flex-col gap-2 py-2">
        <Label>Nama Akun</Label>
        <Input disabled value={data.data.nama} />
      </div>
      <div class="flex w-full flex-col gap-2 py-2">
        <Label>Kategori</Label>
        <Input disabled value={data.data.kategori} />
      </div>
      <div class="flex w-full flex-col gap-2 py-2">
        <Label>Deskripsi</Label>
        <Textarea rows={8} disabled value={data.data.deskripsi} />
      </div>
    </Card.Content>
  </Card.Root>
</div>
