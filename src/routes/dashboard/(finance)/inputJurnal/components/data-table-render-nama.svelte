<script lang="ts">
  import type { selectAkun } from '$lib/server/schema/keuangan';

  export let akun: selectAkun;
</script>

<div class="flex flex-col">
  <p>{akun.kode + ' - ' + akun.nama}</p>
</div>
