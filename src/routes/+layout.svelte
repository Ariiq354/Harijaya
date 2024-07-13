<script>
  import { Toaster } from 'svelte-sonner';
  import '../app.pcss';
  import LoadingIndicator from '$lib/components/ui/loadingIndicator/loadingIndicator.svelte';
</script>

<Toaster richColors closeButton={true} />
<LoadingIndicator />
<slot />
