<script lang="ts">
  import type { selectAkun } from '$lib/server/schema/keuangan';

  export let akunDebit: selectAkun;
  export let akunKredit: selectAkun;
</script>

<div class="flex flex-col">
  <p>{akunDebit.kode + ' - ' + akunDebit.nama}</p>
  <p>{akunKredit.kode + ' - ' + akunKredit.nama}</p>
</div>
