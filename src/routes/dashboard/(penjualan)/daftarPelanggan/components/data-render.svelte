<script lang="ts">
  import type { selectAkun } from '$lib/server/schema/keuangan';

  export let namaBank: string;
  export let noRekening: string;
</script>

<p>{namaBank + ' - ' + noRekening}</p>
