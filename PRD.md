# ✦ Desktopalie Backoffice — Product Requirement Document (PRD) & Multi-Layer System Architecture Specification

---

## 📌 Document Metadata
- **Document Title**: Desktopalie Backoffice PRD & Architectural Layers Specification
- **Ecosystem**: Desktopalie Platform & Backoffice Admin Workspace
- **Author**: Faiz Ali (Lead Architect & Developer)
- **Version**: v2.5.0
- **Status**: Approved & Production Ready
- **Primary Domain**: `https://back.desktopalie.my.id`

---

## 🏛️ Comprehensive 13-Layer Technical System Architecture

```text
+-----------------------------------------------------------------------------------+
|                            LAYER 1: FRONTEND (REACT 19)                            |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        LAYER 10: CACHE CDN (CLOUDFLARE / VERCEL)                   |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                     LAYER 11: LOAD BALANCER & AUTO SCALING                        |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        LAYER 9: RATE LIMITING & SECURITY WAF                      |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                  LAYER 4: AUTHENTICATION & AUTHORIZATION (PKCE / JWT)            |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                     LAYER 2: API BACKEND LOGIC (SUPABASE JS / REST)               |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                 LAYER 8: ROW LEVEL SECURITY (POSTGRESQL RLS POLICIES)             |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                   LAYER 3: DATABASE (SUPABASE POSTGRESQL & JSONB)                 |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|             LAYER 12 & 13: LOGS, AVAILABILITY, RECOVERY & OBSIDIAN SYNC           |
+-----------------------------------------------------------------------------------+
```

---

### 1. 🎨 Layer Frontend
- **Framework & Bundler**: **React 19** + **Vite 6** (Single Page Application architecture).
- **Design System & Styling**: CSS Custom Properties (Theme CSS Variables), Modern Light Mode & Dark Mode System, Responsive Grid System.
- **Routing & Navigation**: `react-router-dom` v7 dengan Protected Route Guards (`ProtectedLayout`, `DesktopOnlyGuard`).
- **Dynamic Multi-Brand Flavoring System**: Mampu memuat 4 platform secara dinamis (*Platform 1 - Alpha Main*, *Platform 2 - Beta Logistics*, *Platform 3 - Gamma Streaming*, *Platform 4 - Delta Financial ERP*).
- **User Interface Modules**:
  - Dashboard Analytics Overview & Telemetry
  - Projects & Case Studies Manager
  - Experiments Lab & Motion Prototype Manager
  - Notes & Learning Journal Manager
  - Bookmarks & Resource Library
  - Notion/Jira Style Kanban To-Do Board dengan Subtask QA Checklist
  - Knowledge Base & System Documentation Manager (dengan Obsidian Integration)
  - Profile & Account Settings
  - Maintenance Mode & System Toggle Manager

---

### 2. ⚡ Layer API Backend Logic
- **API Client Layer**: Integrated `@supabase/supabase-js` client module ([supabase.js](file:///d:/faizali/backoffice-desktopalie/src/lib/supabase.js)).
- **Service Abstraction**: Centralized API abstraction layer ([backofficeService.js](file:///d:/faizali/backoffice-desktopalie/src/services/backofficeService.js)) untuk seluruh operasi CRUD (`getProjects`, `createProject`, `getTodos`, `createTodo`, `getDocs`, `saveSiteSetting`, `uploadMedia`).
- **Real-Time Data Broadcasting**: PostgreSQL Live Broadcast Realtime channel synchronization.
- **Optimistic State Management**: UI langsung ter-update seketika (*optimistic update*) sebelum respon jaringan selesai.

---

### 3. 🗄️ Layer Database
- **Database Engine**: **PostgreSQL** hosted on **Supabase Managed Cloud**.
- **Relational Tables**:
  - `profiles`: Data akun pengguna (id, full_name, username, bio, avatar_url, role, updated_at).
  - `projects`: Portofolio proyek (id, slug, title, type, description, cover_url, progress, status, tone, platform_id).
  - `experiments`: Prototipe UI/UX (id, slug, title, type, description, status, tone, platform_id).
  - `notes`: Catatan ide (id, slug, title, type, description, status, tone, platform_id).
  - `bookmarks`: Referensi tautan (id, title, url, source, platform_id).
  - `todos`: Tugas Kanban (id, title, description, status, priority, category, subtasks JSONB, platform_id).
  - `documentation`: Basis pengetahuan sistem (id, title, folder, slug, author, content, platform_id).
  - `site_settings`: JSONB Key-Value Store untuk konfigurasi maintenance, landing page, dan Obsidian Vault Sync (`obsidian_vault_docs`).
- **JSONB Extension**: Dukungan kolom JSONB dinamis untuk skema fleksibel tanpa downtime migrasi.

---

### 4. 🔐 Layer Authentication and Authorization
- **Authentication Engine**: **Supabase Auth** mendukung Email/Password dan OAuth 2.0 PKCE.
- **Session Tokens**: JWT (JSON Web Tokens) dengan pembaharuan otomatis (*auto refresh token*).
- **Authorization & Role Guards**: Context Provider (`AuthContext.jsx`) mengontrol hak akses `Administrator` vs `Member`.
- **Idle Timeout Security**: Otomatis menangani pasif session timeout untuk keamanan sesi administrator.

---

### 5. 🌐 Layer Hosting and Deployment
- **Hosting Provider**: **Vercel Global Edge Network**.
- **Custom Domains & SSL**:
  - Backoffice Workspace: `https://back.desktopalie.my.id`
  - Public Main Website: `https://desktopalie.my.id`
- **Build Output**: Optimized Vite SPA static bundle dengan automatic gzip/brotli compression.

---

### 6. ☁️ Layer Cloud Compute
- **Serverless & Edge Compute**: Cloudflare Edge Workers & Vercel Serverless Functions.
- **Supabase Database Compute**: Managed PostgreSQL compute instance dengan auto-vacuum & query optimizer.

---

### 7. 🔄 Layer CI/CD Version Control
- **Version Control System**: **Git** & **GitHub Repository** (`faizalidesk/backoffice-desktopalie`).
- **Continuous Integration / Continuous Deployment (CI/CD)**:
  - Otomatis melakukan *build & deploy* ke Vercel setiap kali ada perintah `git push origin main`.
  - Zero-downtime deployment dengan atomic rollback jika build gagal.

---

### 8. 🛡️ Layer Role Level Security (RLS)
- **PostgreSQL Row Level Security (RLS)**: RLS diaktifkan secara ketat pada seluruh tabel (`ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY`).
- **Security Policies**:
  - `SELECT`: Diizinkan publik / terautentikasi sesuai domain & platform ID.
  - `INSERT / UPDATE / DELETE`: Dibatasi hanya untuk administrator / pemilik data bertoken sah (`auth.uid() = user_id`).

---

### 9. 🚧 Layer Rate Limiting
- **Cloudflare WAF Rate Limiting**: Perlindungan terhadap serangan DDoS, Brute Force Login, dan bot jahat pada DNS Cloudflare.
- **Supabase API Gateway Limits**: Pembatasan hingga 100 request/detik per IP address untuk melindungi database dari lonjakan trafik abnormal.

---

### 10. 🚀 Layer Cache & CDN
- **Global Edge CDN**: Cache statis di node edge Cloudflare & Vercel Edge Network.
- **Client-Side Cache Caching**: Browser `localStorage` caching key (`desktopalie_*_fallback_*`) untuk akses data instan offline tanpa jeda jaringan.

---

### 11. ⚖️ Layer Load Balancer & Auto-Scaling
- **Edge Load Balancing**: Vercel Multi-Region Global Edge Load Balancing mendistribusikan trafik pengguna ke server terdekat secara otomatis.
- **Database Connection Pooling**: Supabase **PgBouncer** connection pooler menangani ribuan koneksi konkuren secara efisien.

---

### 12. 📊 Layer Error Tracking & Log
- **Frontend Error Boundaries**: React Error Boundary menangkap exception runtime UI secara elegan.
- **Task & Shell Command Logs**: Seluruh eksekusi skrip background dan build Vite dicatat di file log lokal (`.system_generated/tasks/`).
- **Vercel & Supabase Audit Logs**: Log HTTP request status, error 4xx/5xx, dan jejak audit aktivitas database.

---

### 13. 🔄 Layer Availability and Recovery
- **High Availability (HA)**: 99.9% Uptime SLA didukung oleh infrastruktur Vercel & Supabase.
- **Automated Database Backups**: Backup harian otomatis Supabase PostgreSQL point-in-time recovery (PITR).
- **Bi-directional Obsidian Vault Recovery**: Data dokumentasi & catatan dapat secara instan direcovery/disinkronkan dari file Markdown lokal di `C:\Users\Cerebrum\Documents\Obsidian Vault\Desktopalie Workspace` menggunakan script `npm run obsidian:sync`.

---

© 2026 Desktopalie Backoffice. All rights reserved.
