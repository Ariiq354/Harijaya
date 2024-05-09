import { BriefcaseBusiness, LayoutDashboard, ShoppingCart, Wallet } from 'lucide-svelte';

export const sidebarItem = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    title: 'Dashboard'
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
        href: '/dashboard/fakturPembelian',
        title: 'Faktur Pembelian'
      },
      {
        href: '/dashboard/pemesananPembelian',
        title: 'Pemesanan Pembelian'
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
