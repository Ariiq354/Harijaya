<script lang="ts">
  import { navigating } from '$app/stores';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Topbar from '$lib/components/Topbar.svelte';
  import { Loader2 } from 'lucide-svelte';
</script>

<div class="flex">
  <Sidebar />
  <div class="flex flex-1 flex-col bg-background">
    <Topbar />
    <div class="container h-full w-full bg-slate-100 py-4">
      <!-- {#if $navigating}
        <div class="flex h-full w-full items-center justify-center">
          <Loader2 class="animate-spin" size="50" />
        </div>
      {:else}
        <slot />
      {/if} -->
      <slot />
    </div>
  </div>
</div>
