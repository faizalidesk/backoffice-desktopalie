# 🚀 Desktopalie Backoffice Workspace

Dokumentasi resmi dan panduan pengembangan terarah (*phase-by-phase roadmap*) untuk **Desktopalie Backoffice** — Panel administrasi modern berbasis React & Supabase untuk mengelola portofolio proyek, eksperimen UI/motion, catatan internal, referensi bookmark, dan profil administrator.

---

## 📌 1. Informasi Proyek & Tech Stack

- **Frontend Framework**: React 19 + Vite 6
- **Routing**: React Router DOM (v7)
- **Backend & Database**: Supabase (`@supabase/supabase-js`)
- **Design System**: Modern Light Mode Theme (Vanilla CSS dengan CSS Variables, typography *Plus Jakarta Sans* & *JetBrains Mono*)
- **Notifikasi & Iconography**: `react-hot-toast` & `react-icons`
- **Deployment Platform**: Vercel

---

## 📁 2. Struktur Direktori Proyek

```text
backoffice-desktopalie/
├── public/                 # Aset statis aplikasi
├── src/
│   ├── components/         # Komponen Reusable UI
│   │   ├── Header.jsx      # Topbar header dengan status koneksi Supabase
│   │   ├── Sidebar.jsx     # Navigasi utama & profil pengguna
│   │   └── Modal.jsx       # Dialog modal universal untuk formulir CRUD
│   ├── context/
│   │   └── AuthContext.jsx # Provider otentikasi & proteksi Role Administrator
│   ├── lib/
│   │   └── supabase.js     # Inisialisasi Supabase Client & error handler
│   ├── pages/              # Halaman Utama Backoffice
│   │   ├── Dashboard.jsx            # Ringkasan statistik & pintasan cepat
│   │   ├── ProjectsManager.jsx      # Manajemen Portofolio Proyek
│   │   ├── ExperimentsManager.jsx   # Manajemen R&D / Eksperimen Lab
│   │   ├── NotesManager.jsx         # Catatan Internal & Journal
│   │   ├── BookmarksManager.jsx     # Simpanan Referensi Web & Link
│   │   ├── ProfileSettings.jsx      # Pengaturan Akun & Profil
│   │   ├── Login.jsx                # Halaman Autentikasi Masuk
│   │   └── Register.jsx             # Halaman Pendaftaran Akun Admin
│   ├── services/
│   │   └── backofficeService.js # Layer API CRUD ke Supabase Database
│   ├── App.jsx             # Routing & Proteksi Halaman (ProtectedLayout)
│   ├── index.css           # Design System & Styling Global (Light Theme)
│   └── main.jsx            # Entry Point Aplikasi
├── .env.example            # Templat variabel lingkungan
├── .gitignore              # Konfigurasi pengabaian file Git
├── package.json            # Dependensi & skrip proyek
└── vite.config.js          # Konfigurasi Vite bundler
```

---

## 🗄️ 3. Skema Database Supabase

Database menggunakan 5 tabel utama di PostgreSQL Supabase dengan keamanan *Row Level Security (RLS)* dan PostgreSQL Trigger:

1. **`auth.users`** (Bawaan Supabase Auth):
   - Menyimpan kredensial otentikasi (Email & Encrypted Password).
2. **`public.profiles`**:
   - Menyimpan detail profil admin (`id`, `full_name`, `role`, `bio`, `avatar_url`, `location`, `website`).
   - *Otomatis dibuat saat registrasi melalui PostgreSQL Trigger `handle_new_user()`*.
3. **`public.projects`**:
   - Menyimpan data karya portofolio (`id`, `user_id`, `title`, `slug`, `type`, `description`, `status`, `progress`, `tone`, `demo_url`, `github_url`).
4. **`public.experiments`**:
   - Menyimpan eksperimen UI/motion (`id`, `user_id`, `title`, `slug`, `type`, `description`, `status`, `tone`).
5. **`public.notes`**:
   - Menyimpan catatan internal (`id`, `user_id`, `title`, `slug`, `type`, `description`, `status`, `tone`).
6. **`public.bookmarks`**:
   - Menyimpan link referensi (`id`, `user_id`, `title`, `url`, `source`).

---

## 🗺️ 4. Peta Jalan Pengembangan (Phase per Phase)

Agar pengembangan proyek berjalan secara terstruktur dan terarah, berikut adalah tahapan pengembangan (*Phase-by-Phase Roadmap*):

### ✅ Phase 1: Inisialisasi, Autentikasi & Design System *(Selesai)*
- [x] Inisialisasi proyek React 19 + Vite 6.
- [x] Konfigurasi Supabase Client & Environment Variables.
- [x] Pembuatan halaman Login (`/login`) & Register (`/register`).
- [x] Proteksi rute (`ProtectedLayout`) & validasi Role Administrator (`AuthContext`).
- [x] Pengalihan sistem desain dari Dark Mode ke **Modern Light Mode Theme** yang bersih.

### ✅ Phase 2: Manajemen Modul Utama CRUD *(Selesai)*
- [x] Modul Dashboard Overview (`Dashboard.jsx`) dengan kartu statistik & pintasan cepat.
- [x] Modul Projects Manager (`ProjectsManager.jsx`) dengan fitur Tambah, Edit, Hapus, Cari, & Progress Bar.
- [x] Modul Experiments Lab (`ExperimentsManager.jsx`) dengan manajemen status & tone badge.
- [x] Modul Notes & Journal (`NotesManager.jsx`) dengan pengkategorian tipe catatan.
- [x] Modul Bookmarks (`BookmarksManager.jsx`) dengan simpanan link referensi web.
- [x] Modul Profile Settings (`ProfileSettings.jsx`) untuk update bio & profil admin.

### 🚀 Phase 3: Integrasi File Media & Supabase Storage *(Tahap Selanjutnya)*
- [ ] Buat Supabase Storage Bucket `backoffice-assets` untuk gambar project & avatar.
- [ ] Tambahkan komponen **Image Upload Drag-and-Drop** di Modal Project & Profile.
- [ ] Integrasi gambar thumbnail/cover untuk setiap item portofolio & eksperimen.
- [ ] Fitur preview gambar sebelum di-upload.

### 🚀 Phase 4: Rich Text Editor & Manajemen Kategori *(Pengembangan)*
- [ ] Integrasi Rich Text Editor (contoh: Tiptap / Quill) pada modul Catatan (`NotesManager.jsx`).
- [ ] Fitur penambahan Tag / Kategori dinamis pada Projects & Experiments.
- [ ] Fitur Pin Catatan (*Pinned Notes*) agar catatan penting selalu muncul di atas.
- [ ] Fitur *Export Data* (Export to JSON / CSV).

### 🚀 Phase 5: Keamanan RLS, Audit Logs & Optimasi Performa *(Finalisasi)*
- [ ] Pengetatan aturan Supabase Row Level Security (RLS) berbasis ID Pengguna & Role.
- [ ] Penambahan tabel `audit_logs` untuk mencatat riwayat perubahan data oleh admin.
- [ ] Optimasi *Code Splitting* di Vite untuk memperkecil ukuran bundle JavaScript (`manualChunks`).
- [ ] Otomatisasi integrasi API ke aplikasi utama/klien (Portofolio Publik).

---

## 🛠️ 5. Perintah & Cara Menjalankan

### Menjalankan di Lokal:
```bash
# 1. Install dependensi
npm install

# 2. Jalankan server pengembangan
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5174`.

### Menguji Build Produksi:
```bash
npm run build
```

---

## 🌐 6. Konfigurasi Vercel Deployment

Di **Vercel Dashboard** -> **Project Settings** -> **Environment Variables**, pastikan dua variabel berikut sudah terpasang:

| Key | Deskripsi |
|---|---|
| `VITE_SUPABASE_URL` | URL Endpoint Supabase Project |
| `VITE_SUPABASE_ANON_KEY` | Public Anon Key Supabase Project |

*Setelah menambahkan variabel di atas di Vercel Settings, lakukan **Redeploy** pada deployment terbaru di Vercel agar build menyertakan variabel tersebut.*

---

© 2026 Desktopalie Backoffice. Developed with React & Supabase.
