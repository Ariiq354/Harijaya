import { BriefcaseBusiness, HandCoins, LayoutDashboard, ShoppingCart, Wallet } from 'lucide-svelte';

export const sidebarItem = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    title: 'Dashboard'
  },
  {
    icon: HandCoins,
    title: 'Finance',
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
        title: 'Daftar Pemasok'
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
        href: '/dashboard/daftarProduk',
        title: 'Daftar Produk'
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
    title: 'Inventory',
    child: [
      {
        href: '/dashboard/daftarInventory',
        title: 'Daftar Inventory'
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
        href: '/dashboard/stockOpname',
        title: 'Stock Opname'
      }
    ]
  }
];
