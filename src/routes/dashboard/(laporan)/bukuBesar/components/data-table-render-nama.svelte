<script lang="ts">
  import type { Akun } from '$lib/server/database/schema/keuangan';

  export let akun: Akun;
</script>

<div class="flex flex-col">
  <p>{akun.kode + ' - ' + akun.nama}</p>
</div>
