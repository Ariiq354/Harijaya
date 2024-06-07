import { BriefcaseBusiness, HandCoins, LayoutDashboard, ShoppingCart, Wallet } from 'lucide-svelte';

export const sidebarItem = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    title: 'Dashboard'
  },
  {
    icon: HandCoins,
    title: 'Keuangan',
    child: [
      {
        href: '/dashboard/daftarAkun',
        title: 'Daftar Akun'
      },
      {
        href: '/dashboard/inputJurnal',
        title: 'Input Jurnal'
      }
    ]
  },
  {
    icon: ShoppingCart,
    title: 'Pembelian',
    child: [
      {
        href: '/dashboard/daftarPemasok',
        title: 'Daftar Supplier'
      },
      {
        href: '/dashboard/pemesananPembelian',
        title: 'Pemesanan Pembelian'
      },
      {
        href: '/dashboard/fakturPembelian',
        title: 'Faktur Pembelian'
      }
    ]
  },
  {
    icon: Wallet,
    title: 'Penjualan',
    child: [
      {
        href: '/dashboard/daftarBarang',
        title: 'Daftar Barang'
      },
      {
        href: '/dashboard/daftarPelanggan',
        title: 'Daftar Pelanggan'
      },
      {
        href: '/dashboard/pemesananPenjualan',
        title: 'Pemesanan Penjualan'
      },
      {
        href: '/dashboard/fakturPenjualan',
        title: 'Faktur Penjualan'
      }
    ]
  },
  {
    icon: BriefcaseBusiness,
    title: 'Persediaan Barang',
    child: [
      {
        href: '/dashboard/daftarStok',
        title: 'Daftar Stok'
      },
      {
        href: '/dashboard/penerimaanBarang',
        title: 'Penerimaan Barang'
      },
      {
        href: '/dashboard/pengirimanBarang',
        title: 'Pengiriman Barang'
      },
      {
        href: '/dashboard/stockFisik',
        title: 'Stok Fisik'
      }
    ]
  }
];
