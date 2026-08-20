# ✦ Panduan Kolaborasi Tim — Desktopalie Backoffice
> **Dokumen Pembagian Tugas, Pemetaan File, dan SOP Git/GitHub**  
> **Tim**: 🌸 **Nisa** (UI/UX & Frontend Styling) & ⚡ **Pais** (Backend, Logic & Database)

---

## 📌 1. Gambaran Singkat Project

**Desktopalie Backoffice** adalah panel administrasi multi-platform terpadu yang dibangun dengan:
- **Frontend Stack**: React 19 + Vite 6 + React Router v7 + React Icons + Vanilla CSS (Design System / CSS Variables).
- **Backend & Database**: Supabase Cloud (PostgreSQL, Row Level Security, Auth PKCE, Realtime Broadcast).
- **Fitur Utama**: Multi-flavor Platform (Alpha, Beta, Gamma, Delta), Dark/Light Theme, Obsidian Sync, AI Intelligence Drawer, Todo Kanban Board, Project & Documentation Manager.

---

## 👥 2. Pembagian Peran & Tanggung Jawab

```text
                       ┌─────────────────────────────────────────────────┐
                       │           DESKTOPALIE BACKOFFICE                │
                       └───────────────────────┬─────────────────────────┘
                                               │
               ┌───────────────────────────────┴───────────────────────────────┐
               ▼                                                               ▼
   🌸 NISA (UI / UX & Tampilan)                                    ⚡ PAIS (Logic, Backend & Data)
   • HTML/JSX Markup & Layout                                      • Supabase Database & RLS Policy
   • CSS Styling, Colors, Responsive Design                        • API Services (`backofficeService.js`)
   • Theme (Dark/Light) & Flavors UI                               • Auth Context & Session Token PKCE
   • Komponen visual (Card, Modal, Sidebar, Table)                 • Route Protection & Security Guard
   • Ilustrasi, Icon SVG, Banner, UX Micro-animation               • Integrasi API, AI Gemini & Sync Script
```

---

## 🗺️ 3. Pemetaan File (File Ownership Matrix)

Gunakan tabel ini sebagai acuan kerja agar **tidak terjadi bentrok edit file (*merge conflict*)**:

| Kategori | File / Folder | Penanggung Jawab | Fokus Pengerjaan |
| :--- | :--- | :---: | :--- |
| **Styling Global** | `src/index.css` | 🌸 **Nisa** | Variabel warna, font, dark/light theme, tombol, card, utility class, animasi. |
| **Layout & Navigasi** | `src/components/Sidebar.jsx`<br>`src/components/Header.jsx`<br>`src/components/Modal.jsx` | 🌸 **Nisa** | Desain navigasi, tata letak menu, header bar, animasi dropdown, popup modal. |
| **Komponen UI Visual** | `src/components/NotificationBell.jsx`<br>`src/components/ImageUploader.jsx`<br>`src/components/DesktopalieMark.jsx` | 🌸 **Nisa** | Tampilan upload gambar, badge notifikasi, logo visual & watermark. |
| **Halaman Manajer & Dashboard** | `src/pages/Dashboard.jsx`<br>`src/pages/ProjectsManager.jsx`<br>`src/pages/TodoListManager.jsx`<br>`src/pages/NotesManager.jsx`<br>`src/pages/BookmarksManager.jsx`<br>`src/pages/DocumentationManager.jsx`<br>`src/pages/MembershipManager.jsx`<br>`src/pages/ProfileSettings.jsx`<br>`src/pages/PublicPlatformLanding.jsx` | 🌸 **Nisa** *(Styling & Layout)*<br><br>⚡ **Pais** *(Koneksi Data / API)* | **Nisa**: Merapikan grid, card, form input, tabel, modal, warna status, icon badge.<br>**Pais**: Menyediakan fungsi `fetchData()`, `handleSave()`, state management, dan passing props. |
| **API & Database Service** | `src/services/backofficeService.js`<br>`src/services/agenticAiService.js`<br>`src/services/notificationService.js`<br>`src/lib/supabase.js` | ⚡ **Pais** | Query Supabase (CRUD), fallback cache, broadcast realtime, error handling. |
| **Auth & Security** | `src/context/AuthContext.jsx`<br>`src/components/DesktopOnlyGuard.jsx`<br>`src/pages/Login.jsx`, `Register.jsx` | ⚡ **Pais** *(Logic)*<br><br>🌸 **Nisa** *(Desain Form)* | **Pais**: Logika login/logout PKCE, session token, validasi role.<br>**Nisa**: Mempercantik form login & visual page transition. |
| **Sinkronisasi & Script** | `scripts/sync-obsidian.js`<br>`scripts/obsidian-ai-intelligence.js`<br>`api/gemini.js` | ⚡ **Pais** | Automation script, sync markdown, backend Gemini AI. |
| **Assets & Media** | `src/assets/`, `public/` | 🌸 **Nisa** | Menambahkan favicon, icon SVG, ilustrasi banner, foto mockup. |
| **Config & Deployment** | `vite.config.js`, `vercel.json`, `.env*` | ⚡ **Pais** | Konfigurasi port, routing Vercel, env variable Supabase. |

---

## 💡 4. Best Practice untuk Nisa (Mendesain Tampilan)

1. **Gunakan Dummy Data / Props**:
   - Nisa bisa membuat mockup tampilan dengan data dummy terlebih dahulu (contoh: list task atau card proyek contoh).
   - Setelah tampilan rapi, Pais tinggal menghubungkan `props` tersebut dengan data asli dari `backofficeService.js`.
2. **Gunakan Variable CSS yang Ada di `src/index.css`**:
   - Gunakan variabel warna tema seperti `var(--bg-primary)`, `var(--text-primary)`, `var(--accent-color)` agar tampilan otomatis menyesuaikan ketika user berganti ke Dark Mode atau Light Mode.
3. **Komponen Mandiri**:
   - Jika butuh komponen baru (misal: Button khusus, Badge, Dropdown baru), Nisa bisa buat file baru di dalam folder `src/components/`.

---

## 🚀 5. SOP & Alur Kerja Git/GitHub Langkah demi Langkah

### 💻 A. Setup Pertama Kali di Laptop Nisa (Hanya 1x)
Buka Terminal / PowerShell di laptop Nisa:

```bash
# 1. Clone repository dari GitHub
git clone https://github.com/faizalidesk/backoffice-desktopalie.git
cd backoffice-desktopalie

# 2. Install dependensi
npm install

# 3. Minta file .env dari Pais lalu taruh di root project

# 4. Jalankan project lokal
npm run dev
```
> Project akan berjalan di browser pada alamat `http://localhost:5174`

---

### 🌸 B. Alur Kerja Harian Nisa (Fokus Tampilan)

Setiap Nisa mau mengerjakan tampilan atau halaman baru:

```bash
# 1. Selalu pastikan branch main Anda paling update
git checkout main
git pull origin main

# 2. Buat branch baru khusus tugas UI Anda (contoh: mempercantik dashboard)
git checkout -b ui/dashboard-redesign

# 3. Buka VS Code / Editor, edit file tampilan & CSS...
# 4. Cek hasil di browser (npm run dev)

# 5. Jika sudah selesai dan rapi, simpan & kirim ke GitHub:
git add .
git commit -m "UI: Merapikan layout card dashboard dan responsive view"
git push origin ui/dashboard-redesign
```

---

### ⚡ C. Alur Kerja Harian Pais (Fokus Backend & Logic)

Setiap Pais mau menambahkan logic, database, atau API baru:

```bash
# 1. Tarik update terbaru dari main
git checkout main
git pull origin main

# 2. Buat branch baru khusus fitur logic (contoh: filter todo list)
git checkout -b feat/todo-filter-api

# 3. Koding service, query Supabase, & state logic...

# 4. Simpan & kirim ke GitHub:
git add .
git commit -m "FEAT: Tambah filter category dan query status pada todo list"
git push origin feat/todo-filter-api
```

---

### 🔀 D. Cara Menggabungkan Kode (Pull Request di GitHub)

```text
    ┌─ [Branch: ui/dashboard-redesign] (Nisa) ──┐
    │                                           ├── Pull Request & Review ──► [main] (Auto Deploy Vercel)
    └─ [Branch: feat/todo-filter-api] (Pais) ───┘
```

1. Buka repository di browser: [github.com/faizalidesk/backoffice-desktopalie](https://github.com/faizalidesk/backoffice-desktopalie).
2. GitHub akan otomatis menampilkan banner kuning **"Compare & pull request"** untuk branch yang baru di-push.
3. Klik tombol tersebut, beri judul & deskripsi singkat apa saja yang diubah.
4. Klik tombol hijau **"Create pull request"**.
5. Diskusikan / review bersama, lalu tekan tombol **"Merge pull request"**.
6. Server Vercel akan otomatis melakukan *build & deploy* ke domain resmi `https://back.desktopalie.my.id`!

---

## 🏆 6. Tiga Aturan Emas Kolaborasi

1. 🔄 **Selalu `git pull origin main`** setiap hari sebelum mulai mengetik kode baru.
2. 🌿 **Jangan pernah mengedit langsung di branch `main`**, selalu buat branch baru (`ui/...` untuk Nisa dan `feat/...` untuk Pais).
3. 💬 **Komunikasikan jika menyentuh file yang sama**, terutama di halaman `src/pages/*.jsx`. Beri tahu rekan jika sedang ada perubahan besar pada struktur komponen.

---
*Dokumen ini dibuat untuk tim pengembang Desktopalie Backoffice.*
