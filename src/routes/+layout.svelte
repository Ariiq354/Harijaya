<script>
	import { Toaster } from 'svelte-sonner';
	import '../app.css';
</script>

<Toaster richColors closeButton={true} />

<slot />
