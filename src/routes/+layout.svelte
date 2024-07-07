<script>
  import { Toaster } from 'svelte-sonner';
  import '../app.pcss';
</script>

<Toaster richColors closeButton={true} />

<slot />
