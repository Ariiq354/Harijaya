<script lang="ts">
  import { Boxes, Store } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="grid grid-cols-4 gap-4">
  <div class="flex flex-col gap-4 rounded-lg border-2 p-4">
    <h1 class="text-lg font-semibold">Hutang</h1>
    <div class="text-2xl font-bold">
      Rp {data.utang[0].jumlah}
    </div>
    <p>Jumlah Faktur Pembelian {data.fakturPembelian[0].jumlah}</p>
  </div>
  <div class="flex flex-col gap-4 rounded-lg border-2 p-4">
    <h1 class="text-lg font-semibold">Piutang</h1>
    <div class="text-2xl font-bold">
      Rp {data.piutang[0].jumlah}
    </div>
    <p>Jumlah Faktur Penjualan {data.fakturPenjualan[0].jumlah}</p>
  </div>
  <div class="flex flex-row items-center gap-4 rounded-lg border-2 p-4">
    <Boxes size={80} strokeWidth={0.75} class="h-fit w-auto rounded-full bg-blue-200 p-2" />
    <div class="flex w-full flex-col items-end justify-center gap-2 text-right">
      <p class="text-2xl font-bold">
        {data.barang[0].jumlah}
      </p>
      <p class="text-lg">Barang</p>
    </div>
  </div>
  <div class="flex flex-row items-center gap-4 rounded-lg border-2 p-4">
    <Store size={80} strokeWidth={0.75} />
    <div class="flex w-full flex-col items-end justify-center gap-2 text-right">
      <p class="text-2xl font-bold">
        {data.supplier[0].jumlah}
      </p>
      <p class="text-lg">Supplier</p>
    </div>
  </div>
</div>
