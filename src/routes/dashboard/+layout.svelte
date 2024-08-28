<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Topbar from '$lib/components/Topbar.svelte';
</script>

<div class="flex">
  <Sidebar />
  <div class="flex flex-1 flex-col bg-background">
    <Topbar />
    <div class="grainy container h-full w-full py-4">
      <slot />
    </div>
  </div>
</div>
