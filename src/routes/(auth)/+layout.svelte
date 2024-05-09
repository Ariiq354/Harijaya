<script>
	import { Toaster } from 'svelte-sonner';
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center gap-8">
	<h1 class="text-2xl font-bold">
		<a href="/">
			<img src="/hrj.png" alt="logo" class="w-20" />
		</a>
	</h1>
	<slot />
</div>
