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
      },
      {
        title: 'Utang',
        child: [
          {
            href: '/dashboard/daftarUtang',
            title: 'Daftar Utang'
          },
          {
            href: '/dashboard/pembayaranUtang',
            title: 'Daftar Pembayaran'
          }
        ]
      },
      {
        title: 'Piutang',
        child: [
          {
            href: '/dashboard/daftarPiutang',
            title: 'Daftar Piutang'
          },
          {
            href: '/dashboard/pembayaranPiutang',
            title: 'Daftar Pembayaran'
          }
        ]
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
        href: '/dashboard/stokBahanMentah',
        title: 'Stok Bahan Mentah'
      },
      {
        href: '/dashboard/stokBarangJadi',
        title: 'Stok Bahan Jadi'
      },
      {
        href: '/dashboard/prosesProduksi',
        title: 'Proses Produksi'
      },
      {
        href: '/dashboard/stokFisik',
        title: 'Stok Fisik'
      }
    ]
  }
];
