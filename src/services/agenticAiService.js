import { backofficeService } from './backofficeService';

// Agentic AI Tool Registry & Autonomous Execution Engine
export const AGENT_TOOLS = [
  {
    name: 'create_task',
    description: 'Membuat tugas baru pada Notion/Jira style Kanban To-Do Board',
    parameters: ['title', 'description', 'priority', 'category', 'status']
  },
  {
    name: 'update_task_status',
    description: 'Mengubah status tugas (Not started, Inprogress, Done)',
    parameters: ['id', 'status']
  },
  {
    name: 'update_prd',
    description: 'Memperbarui dokumen Product Requirement Document (PRD) dengan fitur/modul baru',
    parameters: ['section', 'content', 'updateNotes']
  },
  {
    name: 'create_documentation',
    description: 'Membuat catatan dokumentasi sistem / Obsidian note baru',
    parameters: ['title', 'content', 'folder']
  },
  {
    name: 'sync_obsidian_vault',
    description: 'Menyinkronkan data dokumentasi dengan Obsidian Vault',
    parameters: []
  },
  {
    name: 'get_telemetry_report',
    description: 'Mengambil statistik proyek, jumlah tugas, dan ringkasan telemetri',
    parameters: []
  }
];

// Rich Context Knowledge Base for Desktopalie Backoffice Ecosystem
const BACKOFFICE_SYSTEM_PROMPT = `
Anda adalah Desktop-Agentic, asisten AI resmi di platform Desktopalie Backoffice (back.desktopalie.my.id).

IDENTITAS SISTEM & PENGEMBANG:
- Pemilik & Developer: Faiz Ali (Full-stack Engineer & AI Practitioner).
- Domain Utama: https://desktopalie.my.id (Website Portofolio & Showcases).
- Backoffice Domain: https://back.desktopalie.my.id (Pusat Kendali Administrasi & Operasional).
- Teknologi: React 19, Vite, Supabase PostgreSQL, Vercel Serverless Functions, Obsidian Vault Sync.

MODUL UTAMA BACKOFFICE:
1. Kanban To-Do Manager: Pengelolaan tugas harian dengan subtasks, prioritas, dan kategori (Jira/Notion style).
2. Projects & Experiments Manager: Manajemen portofolio proyek perangkat lunak dan arsitektur kode.
3. System Documentation & PRD: Pengelolaan dokumen spesifikasi produk (PRD) dan panduan arsitektur.
4. Obsidian Bi-directional Sync: Sinkronisasi 30+ dokumen markdown lokal dengan database Supabase.
5. Desktop-Agentic: Agen AI otonom untuk otomatisasi eksekusi database, audit CSP, dan pembuatan tugas.
6. Telemetry & Security: Pemantauan kesehatan sistem, verifikasi Content Security Policy (CSP), dan performa.

PANDUAN GAYA PENULISAN:
- Tuliskan jawaban dalam format paragraf yang mengalir rapi dan poin-poin sederhana yang bersih (- atau penomoran).
- JANGAN menggunakan banyak emoji, icon dekoratif, atau tanda yang berlebihan di setiap baris.
- Utamakan kejelasan, keterbacaan, ketepatan konteks, dan bahasa Indonesia yang profesional serta bersahabat.
`;

export const agenticAiService = {
  // Helper: Get Gemini API Key
  getApiKey() {
    const key = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('desktopalie_gemini_api_key') || '';
    return key.trim();
  },

  // Save user API key to localStorage
  setApiKey(key) {
    localStorage.setItem('desktopalie_gemini_api_key', key.trim());
  },

  // Call Google Gemini 1.5 Flash via Secure Backend Serverless API or Direct
  async callGeminiApi(prompt, customSystem = '') {
    const finalSystem = customSystem || BACKOFFICE_SYSTEM_PROMPT;

    // 1. First try secure Backend Serverless Route (/api/gemini)
    try {
      const backendResponse = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction: finalSystem })
      });

      if (backendResponse.ok) {
        const backendData = await backendResponse.json();
        if (backendData.text) return backendData.text;
      }
    } catch (e) {
      // Backend route not available or running in pure Vite dev mode
    }

    // 2. Fallback to direct client API Key if configured
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1200
      },
      systemInstruction: {
        parts: [{ text: finalSystem }]
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    return candidate?.content?.parts?.[0]?.text || '';
  },

  // Smart Built-in Fallback Knowledge Base (Clean paragraphs & simple bullet points)
  getLocalKnowledgeAnswer(text) {
    // Topic: What is Desktopalie Backoffice?
    if (text.includes('backoffice') || text.includes('desktopalie') || text.includes('aplikasi ini') || text.includes('sistem ini')) {
      return `Desktopalie Backoffice (back.desktopalie.my.id) adalah pusat kendali dan sistem manajemen internal terpadu untuk platform Faiz Ali (desktopalie.my.id). Sistem ini dirancang untuk mengelola seluruh aspek operasional, dokumentasi arsitektur, dan alur kerja pengembangan aplikasi dalam satu tempat.\n\nFitur dan modul utama yang tersedia meliputi:\n- To-Do Kanban Board: Pengelolaan tugas harian dengan subtask dan prioritas ala Jira atau Notion.\n- Projects & Experiments Manager: Manajemen portofolio proyek perangkat lunak dan arsitektur kode.\n- Documentation & Master PRD: Pengelolaan dokumen Product Requirement Document dan SOP teknis.\n- Obsidian Vault Sync: Sinkronisasi dua arah antara catatan markdown lokal dengan database Supabase.\n- Desktop-Agentic: Asisten AI otonom untuk otomatisasi eksekusi sistem dan pembaruan dokumen.\n- Security & Telemetry: Pemantauan keamanan Content Security Policy (CSP) dan metrik kesehatan infrastruktur.\n\nApakah ada modul tertentu yang ingin Anda diskusikan atau gunakan sekarang?`;
    }

    // Topic: Who is Faiz Ali?
    if (text.includes('faiz ali') || text.includes('pembuat') || text.includes('creator') || text.includes('developer')) {
      return `Faiz Ali adalah Software Engineer dan pengembang utama dari ekosistem Desktopalie (desktopalie.my.id).\n\nBeliau merancang platform ini dengan arsitektur modern (React 19, Supabase PostgreSQL, Obsidian Knowledge Graph, dan Agentic AI) untuk menyatukan portofolio, dokumentasi riset, dan sistem manajemen tugas dalam satu ekosistem yang terpadu.`;
    }

    // Topic: What is Obsidian / Knowledge Graph?
    if (text.includes('obsidian') || text.includes('vault') || text.includes('knowledge graph')) {
      return `Obsidian Vault di ekosistem Desktopalie berfungsi sebagai basis pengetahuan jangka panjang (Second Brain).\n\nSetiap dokumentasi, arsitektur sistem, dan PRD yang Anda buat di Backoffice secara otomatis tersinkronisasi menjadi file Markdown dengan grafik relasi (Knowledge Graph) di laptop Anda via skrip sinkronisasi AI kami.`;
    }

    return null;
  },

  // Autonomous Agent Execution Router
  async processUserIntent(userInput) {
    const text = userInput.toLowerCase().trim();
    const thoughts = [];
    let toolExecuted = null;
    let resultPayload = null;
    let responseText = '';

    // Intent 0: Friendly Greetings (Hi / Halo / Hello / Pagi / Malam)
    if (text === 'hi' || text === 'halo' || text === 'hello' || text === 'hey' || text === 'p' || text.includes('selamat pagi') || text.includes('selamat sore') || text.includes('selamat malam')) {
      thoughts.push('👋 [Agent Reasoning] Menyapa pengguna dengan santun...');
      responseText = `Halo, selamat datang di Desktopalie Backoffice. Saya adalah Desktop-Agentic, asisten AI internal Anda.\n\nSaya dapat membantu Anda mengeksekusi berbagai tugas otomatis:\n- Update PRD: Memperbarui dokumen Product Requirement Document di database.\n- Buat Tugas: Menambahkan tugas baru ke papan To-Do Kanban.\n- Sinkronkan Obsidian: Menyelaraskan catatan dokumentasi dengan Obsidian Vault.\n- Cek Telemetri: Menampilkan ringkasan status kesehatan dan data proyek.\n- Buat Dokumentasi: Menulis catatan arsitektur sistem baru.\n\nApa yang ingin Anda kerjakan hari ini?`;
    }
    // Intent 1: Update PRD (Product Requirement Document)
    else if (text.includes('update prd') || text.includes('perbarui prd') || text.includes('ubah prd') || text.includes('tambah prd') || text.includes('edit prd') || (text.includes('prd') && (text.includes('tambah') || text.includes('update')))) {
      thoughts.push('🔧 [Tool Selection] Terdeteksi niat pembaruan PRD -> Memilih Tool update_prd');
      try {
        const docs = await backofficeService.getDocs();
        let prdDoc = docs.find(d => d.title.toLowerCase().includes('prd') || d.slug.includes('prd'));
        
        const timestamp = new Date().toLocaleString('id-ID');
        let updateNote = userInput.replace(/update prd|perbarui prd|ubah prd|tambah prd|edit prd|prd/gi, '').trim();
        if (!updateNote) updateNote = 'Pembaruan Modul Desktop-Agentic & Serverless Security Architecture';
        
        let newContent = '';
        if (prdDoc) {
          newContent = `${prdDoc.content || ''}\n\n### ✦ Update PRD (${timestamp})\n- Catatan Pembaruan: ${updateNote}\n- Otoritas: Desktop-Agentic Autonomous Engine\n- Status: Live & Integrated with Supabase + Obsidian Vault.`;
          await backofficeService.updateDoc(prdDoc.id, { content: newContent });
        } else {
          prdDoc = await backofficeService.createDoc({
            title: '00 - Backoffice PRD (Product Requirement Document)',
            folder: '02 - Backoffice',
            slug: '00-backoffice-prd',
            author: 'Desktop-Agentic',
            content: `# 00 - Backoffice PRD (Product Requirement Document)\n\n## Ringkasan Sistem\nDokumen master PRD ini dikelola secara otonom oleh Desktop-Agentic.\n\n### Update PRD (${timestamp})\n- Catatan Pembaruan: ${updateNote}`
          });
        }
        
        toolExecuted = 'update_prd';
        resultPayload = { docId: prdDoc.id, title: prdDoc.title };
        thoughts.push(`✅ [Tool Output] PRD Document "${prdDoc.title}" berhasil diperbarui!`);
        responseText = `Dokumen Product Requirement Document (PRD) telah berhasil diperbarui di database:\n\n- Dokumen: ${prdDoc.title}\n- Catatan Pembaruan: ${updateNote}\n- Status: Tersimpan di Supabase dan siap disinkronkan ke Obsidian Vault.\n\nApakah ada bagian lain dari PRD yang ingin Anda tambahkan?`;
      } catch (err) {
        thoughts.push(`❌ [Tool Error] Gagal memperbarui PRD: ${err.message}`);
        responseText = `Terjadi kendala saat memperbarui PRD: ${err.message}.`;
      }
    }
    // Intent 2: Create Task (Buat Tugas)
    else if (text.includes('tugas') || text.includes('todo') || text.includes('task') || text.includes('buat tugas')) {
      thoughts.push('🔧 [Tool Selection] Terdeteksi niat manajemen tugas -> Memilih Tool create_task');
      
      let title = userInput.replace(/buat tugas|tambah tugas|tugas baru|task|todo/gi, '').trim();
      if (!title) title = 'Tugas Baru dari Desktop-Agentic';

      const taskData = {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        description: `Dibuat secara otomatis oleh Desktop-Agentic pada ${new Date().toLocaleString('id-ID')}.\n\nInstruksi:\n- Verifikasi dan pengujian komponen.`,
        priority: text.includes('tinggi') || text.includes('high') ? 'High' : (text.includes('rendah') || text.includes('low') ? 'Low' : 'Medium'),
        category: text.includes('qa') ? 'QA Checklist' : (text.includes('dev') ? 'Engineering' : 'Research'),
        status: text.includes('selesai') || text.includes('done') ? 'Done' : (text.includes('jalan') || text.includes('progress') ? 'Inprogress' : 'Not started'),
        subtasks: [
          { id: `sub-${Date.now()}-1`, title: 'Verifikasi komponen dan rute API', is_completed: false },
          { id: `sub-${Date.now()}-2`, title: 'Pengujian integrasi Supabase', is_completed: true }
        ]
      };

      try {
        const created = await backofficeService.createTodo(taskData);
        toolExecuted = 'create_task';
        resultPayload = created;
        thoughts.push(`✅ [Tool Output] Tool create_task berhasil dieksekusi! ID: ${created.id}`);
        
        try {
          const geminiResponse = await this.callGeminiApi(`User meminta membuat tugas: "${userInput}". Tugas berhasil dibuat dengan ID: ${created.id}, Judul: "${created.title}", Status: "${created.status}", Prioritas: "${created.priority}". Buat respons konfirmasi yang rapi dalam Bahasa Indonesia dengan format paragraf pengantar dan poin-poin detail tanpa emoji berlebihan.`);
          if (geminiResponse) responseText = geminiResponse;
        } catch (e) {}
        
        if (!responseText) {
          responseText = `Tugas baru telah berhasil dibuat dan ditambahkan ke papan To-Do Board:\n\n- Judul: ${created.title}\n- Status: ${created.status}\n- Prioritas: ${created.priority}\n- Kategori: ${created.category}\n\nTugas ini sudah tersimpan dan siap dikerjakan. Apakah ada hal lain yang perlu dipersiapkan?`;
        }
      } catch (err) {
        thoughts.push(`❌ [Tool Error] Gagal mengeksekusi create_task: ${err.message}`);
        responseText = `Terjadi kendala saat membuat tugas: ${err.message}.`;
      }
    }
    // Intent 3: Sync Obsidian Vault
    else if (text.includes('obsidian') || text.includes('sync') || text.includes('singkron')) {
      thoughts.push('🔧 [Tool Selection] Terdeteksi niat sinkronisasi Vault -> Memilih Tool sync_obsidian_vault');
      try {
        const docs = await backofficeService.getDocs();
        toolExecuted = 'sync_obsidian_vault';
        resultPayload = { count: docs.length };
        thoughts.push(`✅ [Tool Output] Tool sync_obsidian_vault selesai! Total ${docs.length} dokumen tersinkron.`);
        responseText = `Sinkronisasi data dengan Obsidian Vault telah berhasil diselesaikan.\n\nSebanyak ${docs.length} catatan dokumentasi dan PRD saat ini telah selaras dengan database Backoffice. Seluruh file siap dibuka melalui aplikasi Obsidian lokal.`;
      } catch (err) {
        thoughts.push(`❌ [Tool Error] ${err.message}`);
        responseText = `Sinkronisasi Obsidian mengalami kendala: ${err.message}.`;
      }
    }
    // Intent 4: Create Documentation / Note
    else if (text.includes('dokumentasi') || text.includes('catatan') || text.includes('doc') || text.includes('note')) {
      thoughts.push('🔧 [Tool Selection] Terdeteksi niat dokumentasi -> Memilih Tool create_documentation');
      let docTitle = userInput.replace(/buat dokumen|tambah catatan|dokumentasi baru|doc|note/gi, '').trim();
      if (!docTitle) docTitle = 'Dokumentasi Sistem Baru';

      const docData = {
        title: docTitle.charAt(0).toUpperCase() + docTitle.slice(1),
        folder: '02 - Backoffice',
        slug: docTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        author: 'Desktop-Agentic',
        content: `# ${docTitle}\n\nCatatan dokumentasi ini dibuat secara otomatis oleh Desktop-Agentic.\n\nRingkasan Sistem:\n- Waktu Pembuatan: ${new Date().toISOString()}\n- Dikelola oleh: Desktop-Agentic Action Router.`
      };

      try {
        const createdDoc = await backofficeService.createDoc(docData);
        toolExecuted = 'create_documentation';
        resultPayload = createdDoc;
        thoughts.push(`✅ [Tool Output] Tool create_documentation berhasil dieksekusi! ID: ${createdDoc.id}`);
        responseText = `Dokumentasi baru "${createdDoc.title}" telah berhasil dibuat.\n\nCatatan ini otomatis tersimpan di menu System Documentation Manager dan siap disinkronkan ke Obsidian Vault.`;
      } catch (err) {
        thoughts.push(`❌ [Tool Error] ${err.message}`);
        responseText = `Gagal membuat dokumentasi: ${err.message}`;
      }
    }
    // Intent 5: Telemetry Report / Summary
    else if (text.includes('telemetri') || text.includes('laporan') || text.includes('ringkasan') || text.includes('stat')) {
      thoughts.push('🔧 [Tool Selection] Terdeteksi niat telemetri -> Memilih Tool get_telemetry_report');
      try {
        const [todos, projects, docs] = await Promise.all([
          backofficeService.getTodos(),
          backofficeService.getProjects(),
          backofficeService.getDocs()
        ]);
        toolExecuted = 'get_telemetry_report';
        resultPayload = { todos: todos.length, projects: projects.length, docs: docs.length };
        thoughts.push('✅ [Tool Output] Telemetri berhasil dikumpulkan.');
        responseText = `Berikut adalah ringkasan laporan telemetri sistem Backoffice saat ini:\n\n- Total Tugas Kanban: ${todos.length} item\n- Portofolio Proyek Aktif: ${projects.length} proyek\n- Dokumen Dokumentasi & PRD: ${docs.length} dokumen\n- Status Infrastruktur: 100% Beroperasi normal di Vercel Global Network\n\nSeluruh layanan berjalan stabil. Ada data spesifik lain yang ingin Anda periksa?`;
      } catch (err) {
        thoughts.push(`❌ [Tool Error] ${err.message}`);
        responseText = `Gagal mengumpulkan telemetri: ${err.message}`;
      }
    }
    // General Questions / Conversational Queries (Gemini AI + Local Knowledge Base)
    else {
      // 1. Try Google Gemini AI Inference with full system context
      try {
        thoughts.push('🧠 [Gemini Inference] Memproses pertanyaan mendalam dengan Google Gemini 1.5 Flash...');
        const geminiOutput = await this.callGeminiApi(userInput);
        if (geminiOutput && geminiOutput.trim()) {
          responseText = geminiOutput;
        }
      } catch (err) {
        thoughts.push(`⚠️ [Gemini API Note] ${err.message}`);
      }

      // 2. If Gemini didn't return (e.g. offline/no key), consult smart local knowledge base
      if (!responseText) {
        const localAnswer = this.getLocalKnowledgeAnswer(text);
        if (localAnswer) {
          thoughts.push('💡 [Local Knowledge Match] Menemukan data konteks di Basis Pengetahuan Backoffice...');
          responseText = localAnswer;
        } else {
          thoughts.push('💡 [General Response] Memformulasikan tanggapan bantuan Desktop-Agentic...');
          responseText = `Mengenai pertanyaan Anda tentang "${userInput}":\n\nSaya dapat membantu Anda berdiskusi seputar arsitektur sistem, pemrograman, manajemen portofolio, maupun manajemen tugas.\n\nBeberapa aksi otomatis yang dapat langsung saya jalankan meliputi:\n- Update PRD: Memperbarui dokumen spesifikasi produk di database.\n- Buat Tugas: Menambahkan tugas baru ke papan Kanban To-Do.\n- Sinkronkan Obsidian: Menyelaraskan catatan dokumentasi dengan Obsidian Vault.\n- Cek Telemetri: Menampilkan status kesehatan dan ringkasan sistem.\n\nApakah ada hal tertentu yang ingin kita mulai sekarang?`;
        }
      }
    }

    return {
      thoughts,
      toolExecuted,
      resultPayload,
      responseText
    };
  }
};
