# Dokumentasi Teknis POS AHA

## Arsitektur Sistem
Proyek ini dibangun menggunakan **Container-Presentational Pattern** dan **Custom Hooks** untuk memisahkan logika bisnis dari tampilan (UI). Hal ini menjamin kode yang:
- **Clean**: Mudah dibaca dan dipahami.
- **Maintainable**: Mudah dirawat dan dikembangkan.
- **Scalable**: Siap untuk fitur-fitur kompleks di masa depan.
- **Testable**: Logika bisnis dapat dites secara terisolasi tanpa UI.

## Struktur Folder

```
src/
├── app/                  # Routing & Container Components ("Smart")
│   ├── page.tsx          # Dashboard Container
│   ├── finance/page.tsx  # Finance Container
│   ├── pos/page.tsx      # POS Container
│   └── products/page.tsx # Products Container
│
├── components/           # Presentational Components ("Dumb")
│   ├── dashboard/        # DashboardView.tsx
│   ├── finance/          # FinanceView.tsx
│   ├── pos/              # POSView.tsx
│   ├── products/         # ProductListView.tsx
│   └── ui/               # Reusable atomic components (Button, Card, Spinner, etc.)
│
├── hooks/                # Business Logic (State & Handlers)
│   ├── useDashboard.ts   # Mengelola data dashboard
│   ├── useFinance.ts     # Mengelola transaksi keuangan
│   ├── usePOS.ts         # Mengelola keranjang & checkout
│   └── useProducts.ts    # Mengelola CRUD produk
│
├── lib/                  # Utilities & API
│   ├── api.ts            # Centralized API wrapper
│   └── supabase.ts       # Supabase client config
│
└── types/                # TypeScript Interfaces (Single Source of Truth)
    └── index.ts          # Definisi tipe User, Product, Sale, dll.
```

## Design Patterns

### 1. Container-Presentational Pattern
Kami memisahkan setiap halaman menjadi dua bagian:
- **Page (Container)**: Berlokasi di `src/app`. Bertugas memanggil Hook, mengambil data, dan melemparnya ke View.
- **View (Presentational)**: Berlokasi di `src/components`. Murni hanya menerima props dan merender UI. File ini **TIDAK BOLEH** memiliki logic fetching data sendiri.

### 2. Custom Hooks
Semua logic "berfikir" (state management, API calls, calculations) diekstrak ke dalam folder `src/hooks`.
Contoh `usePOS.ts` menangani:
- Kalkulasi total belanja.
- Logika keranjang (tambah/kurang item).
- Proses checkout ke API.

### 3. API Layer Abstraction
UI tidak pernah memanggil `fetch` atau `supabase` secara langsung. Semua panggilan keluar melalui `src/lib/api.ts` yang menyediakan fungsi terstandarisasi seperti `api.products.list()` atau `api.sales.create()`.

### 4. Global Error & Loading Handling
Menggunakan fitur bawaan Next.js App Router:
- `loading.tsx`: Menangani state loading antar halaman secara otomatis.
- `error.tsx`: Menangani crash aplikasi secara elegan tanpa merusak seluruh halaman.

## Application Routes (Daftar Halaman)
Berikut adalah daftar routing yang tersedia dalam aplikasi:

| Route | Halaman | Deskripsi | Container Path |
|-------|---------|-----------|----------------|
| `/` | Dashboard | Halaman utama yang menampilkan statistik ringkas. | `src/app/page.tsx` |
| `/login` | Login | Halaman autentikasi untuk masuk ke aplikasi. | `src/app/login/page.tsx` |
| `/finance` | Keuangan | Pencatatan pemasukan dan pengeluaran. | `src/app/finance/page.tsx` |
| `/products` | Produk | Manajemen inventaris produk (CRUD). | `src/app/products/page.tsx` |
| `/pos` | Kasir (POS) | Point of Sale untuk transaksi penjualan. | `src/app/pos/page.tsx` |
| `/settings` | Pengaturan | Pengaturan aplikasi dan akun pengguna. | `src/app/settings/page.tsx` |
| `/api/*` | API Endpoints | Endpoint backend untuk komunikasi data. | `src/app/api/*` |

## Panduan Pengembangan

### Menambah Fitur Baru
1.  Buat **Interface** baru di `src/types/index.ts`.
2.  Buat **Logic Hook** di `src/hooks/useNamaFitur.ts`.
3.  Buat **Tampilan** di `src/components/namafitur/NamaFiturView.tsx`.
4.  Hubungkan keduanya di page `src/app/namafitur/page.tsx`.

### Code Convention
- Gunakan **TypeScript** secara ketat. Hindari `any`.
- Gunakan **Tailwind CSS** untuk styling.
- Gunakan komponen dari `src/components/ui` (Shadcn UI) untuk konsistensi desain.

---
*Dokumen ini dibuat otomatis sebagai referensi arsitektur sistem POS AHA.*
