<script lang="ts">
  import { Boxes, Store } from 'lucide-svelte';
  import type { PageData } from './$types';
  import Bar from '$lib/components/chart/Bar.svelte';
  import Line from '$lib/components/chart/Line.svelte';

  export let data: PageData;
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
  <div class="flex flex-col gap-4 rounded-lg border-2 bg-white p-4">
    <h1 class="text-lg font-semibold">Hutang</h1>
    <div class="text-2xl font-bold">
      Rp {data.utang[0].jumlah.toLocaleString('id-ID')}
    </div>
    <p>Jumlah Faktur Pembelian {data.fakturPembelian[0].jumlah}</p>
  </div>
  <div class="flex flex-col gap-4 rounded-lg border-2 bg-white p-4">
    <h1 class="text-lg font-semibold">Piutang</h1>
    <div class="text-2xl font-bold">
      Rp {data.piutang[0].jumlah.toLocaleString('id-ID')}
    </div>
    <p>Jumlah Faktur Penjualan {data.fakturPenjualan[0].jumlah}</p>
  </div>
  <div class="flex flex-row items-center gap-4 rounded-lg border-2 bg-white p-4">
    <Boxes size={80} strokeWidth={0.75} />
    <div class="flex w-full flex-col items-end justify-center gap-2 text-right">
      <p class="text-2xl font-bold">
        {data.barang[0].jumlah}
      </p>
      <p class="text-lg">Barang</p>
    </div>
  </div>
  <div class="flex flex-row items-center gap-4 rounded-lg border-2 bg-white p-4">
    <Store size={80} strokeWidth={0.75} />
    <div class="flex w-full flex-col items-end justify-center gap-2 text-right">
      <p class="text-2xl font-bold">
        {data.supplier[0].jumlah}
      </p>
      <p class="text-lg">Supplier</p>
    </div>
  </div>
</div>
<div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
  <div class="rounded-lg border-2 bg-white p-4">
    <h1 class="mb-4 text-center text-xl font-bold">Pembelian vs Penjualan</h1>
    <Bar />
  </div>
  <div class="rounded-lg border-2 bg-white p-4">
    <h1 class="mb-4 text-center text-xl font-bold">Omset Overview</h1>
    <Line />
  </div>
</div>
