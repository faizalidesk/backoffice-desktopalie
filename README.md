# ✦ Desktopalie — Backoffice Workspace Documentation & Roadmap

> **Desktopalie Backoffice** adalah panel administrasi modern yang dibangun dengan **React 19**, **Vite 6**, dan **Supabase** untuk mengelola data portofolio real-time: **Projects**, **Experiments**, **Notes**, **Bookmarks**, dan **Profiles**.

---

## 📌 1. Tech Stack & Sistem Desain

- **Frontend**: React 19 + Vite 6
- **Routing**: React Router DOM v7 (Protected Routing & Auth Protection)
- **Backend & Database**: Supabase (`@supabase/supabase-js`)
- **Theme**: **Modern Light Mode Theme** (Clean Slate White & Indigo Accent System)
- **Notifikasi & Iconography**: `react-hot-toast` & `react-icons`
- **Hosting & Deployment**: Vercel

---

## 📂 2. Struktur Direktori Proyek

```text
backoffice-desktopalie/
├── .env.platform1          # Config Env Platform Alpha
├── .env.platform2          # Config Env Platform Beta
├── .env.platform3          # Config Env Platform Gamma
├── .env.platform4          # Config Env Platform Delta
├── public/                 # Aset statis aplikasi
├── src/
│   ├── components/         # Komponen UI Reusable (Sidebar, Modal, Uploader, dll)
│   ├── config/             # Konfigurasi Flavoring & Multi-Platform
│   │   ├── flavors/        # Objek Konfigurasi Platform (platform1..4)
│   │   │   ├── platform1.js
│   │   │   ├── platform2.js
│   │   │   ├── platform3.js
│   │   │   └── platform4.js
│   │   └── index.js        # Active Flavor Loader (VITE_FLAVOR)
│   ├── context/            # Global React Context Providers
│   │   ├── AuthContext.jsx     # Provider otentikasi Supabase & Role Guard
│   │   ├── FlavorContext.jsx   # Provider Theme & Feature Flags Flavor Dinamis
│   │   ├── LanguageContext.jsx # Provider Bahasa & Lokalisasi
│   │   └── ThemeContext.jsx    # Provider Tema Tampilan
│   ├── lib/
│   │   └── supabase.js     # Inisialisasi Supabase Client & error handling
│   ├── pages/              # Halaman Utama Backoffice
│   │   ├── Dashboard.jsx            # Ringkasan statistik & pintasan cepat
│   │   ├── TodoListManager.jsx      # Manajemen Tugas & To-Do List
│   │   ├── DocumentationManager.jsx # Sistem Knowledge Base & Panduan
│   │   ├── LandingPageManager.jsx   # Manajemen Konten Landing Page
│   │   ├── ProjectsManager.jsx      # Manajemen Portofolio & Case Studies
│   │   ├── ExperimentsManager.jsx   # Manajemen Prototipe UI/UX & Motion
│   │   ├── NotesManager.jsx         # Catatan Desain, Prinsip & Journal
│   │   ├── BookmarksManager.jsx     # Simpanan Referensi Web & Link
│   │   ├── MaintenanceManager.jsx   # Pengaturan Mode Pemeliharaan
│   │   ├── ProfileSettings.jsx      # Pengaturan Profil Administrator
│   │   ├── Login.jsx                # Halaman Autentikasi Masuk
│   │   └── Register.jsx             # Halaman Pendaftaran Akun Admin Baru
│   ├── services/
│   │   └── backofficeService.js     # Layer API CRUD Supabase
│   ├── App.jsx             # Router utama, proteksi rute & FlavorProvider
│   └── index.css           # Styling Global & Dynamic CSS Variables
├── README.md               # Dokumentasi resmi & Arsitektur Flavoring
├── package.json            # Dependensi & skrip Vite multi-platform
└── vite.config.js          # Konfigurasi bundler
```

---

## 🔐 3. Skema Database Supabase Resmi (`supabase_schema.sql`)

Skema tabel di bawah ini terhubung langsung secara presisi dengan aplikasi utama `desktop-alie` dan `backoffice-desktopalie`:

```sql
-- ---------------------------------------------------
-- 1. TABEL PROFILES
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT UNIQUE,
  bio TEXT DEFAULT 'Independent designer & developer',
  avatar_url TEXT,
  location TEXT DEFAULT 'Indonesia',
  website TEXT,
  role TEXT DEFAULT 'Administrator',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update profiles" ON public.profiles FOR UPDATE USING (true);

-- Trigger Otomatis Pembuatan Profil saat Registrasi
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Admin User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'Administrator')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------
-- 2. TABEL PROJECTS
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Web application',
  description TEXT,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'In progress',
  tone TEXT DEFAULT 'violet',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow insert projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update projects" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Allow delete projects" ON public.projects FOR DELETE USING (true);

-- ---------------------------------------------------
-- 3. TABEL EXPERIMENTS
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Motion',
  description TEXT,
  status TEXT DEFAULT 'Draft',
  tone TEXT DEFAULT 'teal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select experiments" ON public.experiments FOR SELECT USING (true);
CREATE POLICY "Allow insert experiments" ON public.experiments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update experiments" ON public.experiments FOR UPDATE USING (true);
CREATE POLICY "Allow delete experiments" ON public.experiments FOR DELETE USING (true);

-- ---------------------------------------------------
-- 4. TABEL NOTES
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Design note',
  description TEXT,
  status TEXT DEFAULT 'Draft',
  tone TEXT DEFAULT 'amber',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select notes" ON public.notes FOR SELECT USING (true);
CREATE POLICY "Allow insert notes" ON public.notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update notes" ON public.notes FOR UPDATE USING (true);
CREATE POLICY "Allow delete notes" ON public.notes FOR DELETE USING (true);

-- ---------------------------------------------------
-- 5. TABEL BOOKMARKS
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select bookmarks" ON public.bookmarks FOR SELECT USING (true);
CREATE POLICY "Allow insert bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete bookmarks" ON public.bookmarks FOR DELETE USING (true);

-- ---------------------------------------------------
-- 7. TABEL TODOS (To-Do & Sprint Board)
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Not started',
  priority TEXT DEFAULT 'Medium',
  category TEXT DEFAULT 'General',
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------
-- 8. TABEL DOCUMENTATION (System Knowledge Base)
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documentation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Guides',
  content TEXT NOT NULL,
  author TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.documentation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select documentation" ON public.documentation FOR SELECT USING (true);
CREATE POLICY "Allow insert documentation" ON public.documentation FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update documentation" ON public.documentation FOR UPDATE USING (true);
CREATE POLICY "Allow delete documentation" ON public.documentation FOR DELETE USING (true);
```

---

## 🗺️ 4. Peta Jalan Pengembangan (Phase per Phase Roadmap)

### ✅ Phase 1: Inisialisasi, Autentikasi & Theme (*Selesai*)
- [x] Inisialisasi React 19 + Vite 6 dengan React Router DOM v7.
- [x] Konfigurasi Supabase Auth Client, Provider, dan Error Handling (`supabase.js`).
- [x] Implementasi halaman Login (`/login`) dan Register (`/register`).
- [x] Proteksi Rute (`ProtectedLayout`) & Proteksi Role Administrator (`AuthContext`).
- [x] Pengalihan sistem desain ke **Clean Light Mode Theme**.

### ✅ Phase 2: Manajemen Modul Utama CRUD (*Selesai*)
- [x] **Dashboard Overview**: Ringkasan total data & pintasan pembuatan data baru.
- [x] **Projects Manager**: CRUD portofolio proyek (`slug`, `title`, `type`, `description`, `progress`, `status`, `tone`).
- [x] **Experiments Lab**: CRUD eksperimen R&D (`slug`, `title`, `type`, `description`, `status`, `tone`).
- [x] **Notes Manager**: CRUD catatan internal (`slug`, `title`, `type`, `description`, `status`, `tone`).
- [x] **Bookmarks Manager**: CRUD link referensi web (`title`, `url`, `source`).
- [x] **Profile Settings**: Pengaturan detail profil admin (`full_name`, `username`, `bio`, `location`, `website`).

### ✅ Phase 3: Media Upload & Supabase Storage (*Selesai*)
- [x] Metode `uploadMedia(file, folder)` di `backofficeService.js` untuk Supabase Storage dengan fallback otomatis.
- [x] Komponen Reusable **ImageUploader Drag-and-Drop** (`ImageUploader.jsx`).
- [x] Integrasi upload cover & preview di **Projects Manager** (`ProjectsManager.jsx`).
- [x] Integrasi upload thumbnail & preview di **Experiments Lab** (`ExperimentsManager.jsx`).
- [x] Integrasi upload Foto Avatar Profil di **Profile Settings** (`ProfileSettings.jsx`).

### 🚀 Phase 4: Rich Text Editor & Pinned Notes (*Pengembangan*)
- [ ] Integrasi Rich Text Editor (Tiptap / Quill) pada Catatan (`NotesManager.jsx`).
- [ ] Fitur Pinning Catatan (`is_pinned`) agar catatan penting berada di posisi teratas.
- [ ] Fitur *Export to JSON/CSV* pada tabel Projects & Bookmarks.

### 🚀 Phase 5: Keamanan RLS & Audit Logs (*Finalisasi*)
- [ ] Pengetatan kebijakan RLS berdasarkan ID Pengguna (`auth.uid() = user_id`).
- [ ] Pencatatan *Audit Logs* aktivitas perubahan data.
- [ ] Integrasi real-time sync antara Backoffice dan Frontend Utama (`desktop-alie`).

---

## ⚙️ 5. Konfigurasi Vercel Environment Variables

Pastikan dua variabel lingkungan berikut terpasang di Vercel Dashboard Settings:

- `VITE_SUPABASE_URL` = `https://nxuumfzpmvolcnswfsqz.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `sb_publishable_tanzxiYEr3IaD8IrGk4zFA_6HintxTJ`

*Setelah menambahkan variabel di Vercel Settings, lakukan **Redeploy** pada deployment terbaru di Vercel.*

---

## 🎨 6. Arsitektur & Penerapan Flavoring (Multi-Platform Support)

Aplikasi Backoffice ini dapat menerapkan **Konsep Flavoring (White-Labeling / Multi-Brand Architecture)** untuk mengelola **4 platform/brand yang berbeda** dari satu codebase utama.

### 🌟 Fitur Utama Flavoring
1. **Branding Dinamis**: Logo, nama platform, favicon, dan dokumen title menyesuaikan platform yang dipilih.
2. **Dynamic CSS Variables**: Color palette (Primary, Secondary, Sidebar Background) di-inject secara dinamis ke Root CSS (`:root`).
3. **Feature Toggles**: Mengaktifkan/mematikan fitur spesifik (seperti Analytics, Export PDF, Multi-Currency) per platform.
4. **Isolasi Config & Credentials**: URL API / Supabase keys terisolasi per platform.

---

### 📂 Struktur Direktori Konfigurasi Flavoring

```text
src/
├── config/
│   ├── flavors/
│   │   ├── platform1.js   # Konfigurasi Platform 1
│   │   ├── platform2.js   # Konfigurasi Platform 2
│   │   ├── platform3.js   # Konfigurasi Platform 3
│   │   └── platform4.js   # Konfigurasi Platform 4
│   └── index.js           # Flavor Loader berdasarkan VITE_FLAVOR
├── context/
│   └── FlavorContext.jsx  # Context Provider untuk Theme & Feature Flags
└── assets/
    └── flavors/           # Asset visual (logo, icons) per platform
```

---

### 💻 Contoh Kode Konfigurasi & Loader

#### 1. File Konfigurasi Platform (`src/config/flavors/platform1.js`)
```javascript
export default {
  id: 'platform1',
  name: 'Backoffice Platform Alpha',
  logo: '/src/assets/flavors/platform1/logo.svg',
  theme: {
    colorPrimary: '#1e40af',   // Blue
    colorSecondary: '#3b82f6',
    bgSidebar: '#0f172a',
  },
  features: {
    enableAnalytics: true,
    enableExportPdf: true,
    enableMultiCurrency: false,
  },
  supabase: {
    url: import.meta.env.VITE_PLATFORM1_SUPABASE_URL,
    anonKey: import.meta.env.VITE_PLATFORM1_SUPABASE_KEY,
  }
};
```

#### 2. Flavor Context Provider (`src/context/FlavorContext.jsx`)
```jsx
import React, { createContext, useContext, useEffect } from 'react';
import { activeFlavor } from '../config';

const FlavorContext = createContext(activeFlavor);

export const FlavorProvider = ({ children }) => {
  useEffect(() => {
    document.title = activeFlavor.name;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', activeFlavor.theme.colorPrimary);
    root.style.setProperty('--color-secondary', activeFlavor.theme.colorSecondary);
    root.style.setProperty('--bg-sidebar', activeFlavor.theme.bgSidebar);
  }, []);

  return (
    <FlavorContext.Provider value={activeFlavor}>
      {children}
    </FlavorContext.Provider>
  );
};

export const useFlavor = () => useContext(FlavorContext);
```

---

### ⚡ Skrip Pembangunan & Mode Eksekusi (`package.json`)

Konfigurasi skrip eksekusi dan build untuk 4 platform di `package.json`:

```json
"scripts": {
  "dev:p1": "vite --mode platform1",
  "dev:p2": "vite --mode platform2",
  "dev:p3": "vite --mode platform3",
  "dev:p4": "vite --mode platform4",

  "build:p1": "vite build --mode platform1 --outDir dist/p1",
  "build:p2": "vite build --mode platform2 --outDir dist/p2",
  "build:p3": "vite build --mode platform3 --outDir dist/p3",
  "build:p4": "vite build --mode platform4 --outDir dist/p4",
  "build:all": "npm run build:p1 && npm run build:p2 && npm run build:p3 && npm run build:p4"
}
```

---

### 🔑 Environment Variables (`.env.platform1`, dll)

Setiap platform menggunakan file `.env` terpisah:

```env
# .env.platform1
VITE_FLAVOR=platform1

# .env.platform2
VITE_FLAVOR=platform2

# .env.platform3
VITE_FLAVOR=platform3

# .env.platform4
VITE_FLAVOR=platform4
```

---

© 2026 Desktopalie Backoffice. All rights reserved.

