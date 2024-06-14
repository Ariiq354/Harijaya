<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { Copy, Edit, MoreHorizontal } from 'lucide-svelte';

  export let id: string;
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
      <MoreHorizontal class="h-4 w-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item href={`/dashboard/daftarBarang/${id}/detail`}>
      <Copy class="mr-2 h-4 w-4" />
      Detail
    </DropdownMenu.Item>
    <DropdownMenu.Item href={`/dashboard/daftarBarang/${id}`}>
      <Edit class="mr-2 h-4 w-4" />
      Edit
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
