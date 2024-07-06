<script lang="ts">
  import type { selectAkun } from '$lib/server/schema/keuangan';

  export let namaBank: string;
  export let namaRekening: string;
</script>

<p>{namaBank + ' - ' + namaRekening}</p>
