<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import Modal from '$lib/components/ui/modal.svelte';
  import { Copy, Edit, Loader2, MoreHorizontal, Trash } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import type { SubmitFunction } from '../$types';

  export let id: string;
  export let bayar = false;
  let isOpen = false;
  let loading = false;

  const addTodo: SubmitFunction = () => {
    loading = true;

    return ({ result }) => {
      if (result.type === 'failure') {
        toast.error(result.data?.message!);
      } else {
        loading = false;
        isOpen = false;
        invalidateAll();
        toast.success('Faktur Pembelian Dihapus');
      }
    };
  };
</script>

<Modal
  title="Apakah anda yakin?"
  description="Tindakan ini tidak dapat dibatalkan"
  {isOpen}
  onClose={() => (isOpen = false)}
>
  <div class="flex w-full items-center justify-end space-x-2 pt-6">
    <Button disabled={loading} variant="outline" on:click={() => (isOpen = false)}>Batal</Button>
    <form action="?/delete&id={id}" method="post" use:enhance={addTodo}>
      <Button disabled={loading} variant="destructive" type="submit">
        {#if loading}
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {/if}
        Lanjut
      </Button>
    </form>
  </div>
</Modal>
<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      variant="ghost"
      builders={[builder]}
      size="icon"
      class="relative h-8 w-8 p-0"
      title="Table action"
    >
      <MoreHorizontal class="h-4 w-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item href={`/dashboard/fakturPembelian/${id}/detail`}>
      <Copy class="mr-2 h-4 w-4" />
      Detail
    </DropdownMenu.Item>
    {#if bayar}
      <DropdownMenu.Item href={`/dashboard/fakturPembelian/${id}`}>
        <Edit class="mr-2 h-4 w-4" />
        Edit
      </DropdownMenu.Item>
      <DropdownMenu.Item on:click={() => (isOpen = true)}>
        <Trash class="mr-2 h-4 w-4" />
        Hapus
      </DropdownMenu.Item>
    {/if}
  </DropdownMenu.Content>
</DropdownMenu.Root>
