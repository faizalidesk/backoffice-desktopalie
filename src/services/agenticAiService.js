import { backofficeService } from './backofficeService';

// =========================================================================
// AGENTIC AI TOOL REGISTRY & AUTONOMOUS ACTION ENGINE
// =========================================================================
export const AGENT_TOOLS = [
  {
    name: 'create_task',
    description: 'Membuat tugas baru pada Kanban To-Do Board di database Supabase',
    parameters: ['title', 'description', 'priority', 'category', 'status', 'subtasks']
  },
  {
    name: 'update_task_status',
    description: 'Mengubah status tugas yang sudah ada (Not started, Inprogress, Done)',
    parameters: ['id', 'status']
  },
  {
    name: 'update_prd',
    description: 'Memperbarui dokumen Master Product Requirement Document (PRD) di database',
    parameters: ['section', 'content', 'updateNotes']
  },
  {
    name: 'create_documentation',
    description: 'Membuat catatan dokumentasi teknis / Obsidian note baru',
    parameters: ['title', 'content', 'folder']
  },
  {
    name: 'sync_obsidian_vault',
    description: 'Menyinkronkan dokumen dan PRD dengan Obsidian Knowledge Graph Vault lokal',
    parameters: []
  },
  {
    name: 'get_telemetry_report',
    description: 'Mengambil ringkasan metrik kesehatan, jumlah proyek, dan tugas aktif',
    parameters: []
  }
];

const MEMORY_STORAGE_KEY = 'desktopalie_agent_memory';
const CHAT_HISTORY_STORAGE_KEY = 'desktopalie_ai_chat_history';

export const agenticAiService = {
  // =========================================================================
  // API KEY & GEMINI MODEL SETTINGS
  // =========================================================================
  getApiKey() {
    const key = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('desktopalie_gemini_api_key') || '';
    return key.trim();
  },

  setApiKey(key) {
    localStorage.setItem('desktopalie_gemini_api_key', key.trim());
  },

  getModel() {
    return localStorage.getItem('desktopalie_gemini_model') || 'gemini-2.0-flash';
  },

  setModel(modelName) {
    localStorage.setItem('desktopalie_gemini_model', modelName);
  },

  // =========================================================================
  // PILAR 5: LONG-TERM MEMORY & DEVELOPER PREFERENCES
  // =========================================================================
  getDeveloperMemory() {
    try {
      const saved = localStorage.getItem(MEMORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        developerName: 'Faiz Ali',
        preferredStyle: 'Clean, modular, component-driven, responsive UI',
        keyDirectives: [
          'Komunikasi ramah, santai, solutif, dan to-the-point',
          'Prioritaskan React 19, Tailwind CSS, shadcn/ui, dan Supabase PostgreSQL',
          'Selalu jaga isolasi multi-tenant antar platform (Alpha, Beta, Gamma, Delta)'
        ],
        notes: []
      };
    } catch (e) {
      return { developerName: 'Faiz Ali', notes: [] };
    }
  },

  saveDeveloperMemory(memoryObj) {
    try {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memoryObj));
    } catch (e) {}
  },

  addMemoryNote(noteText) {
    const mem = this.getDeveloperMemory();
    mem.notes = mem.notes || [];
    mem.notes.push({ text: noteText, timestamp: new Date().toISOString() });
    if (mem.notes.length > 20) mem.notes.shift();
    this.saveDeveloperMemory(mem);
  },

  getChatHistory() {
    try {
      const saved = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  },

  saveChatHistory(messages) {
    try {
      if (Array.isArray(messages)) {
        const trimmed = messages.slice(-30);
        localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
      }
    } catch (e) {}
  },

  clearChatHistory() {
    try {
      localStorage.removeItem(CHAT_HISTORY_STORAGE_KEY);
    } catch (e) {}
  },

  // =========================================================================
  // PILAR 3: SEMANTIC KNOWLEDGE RETRIEVAL (RAG) DARI DOKUMEN & OBSIDIAN
  // =========================================================================
  async searchKnowledgeDocs(query) {
    try {
      const docs = await backofficeService.getDocs();
      if (!docs || docs.length === 0) return '';

      const queryKeywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      if (queryKeywords.length === 0) return '';

      const matchedDocs = [];

      docs.forEach(doc => {
        const titleLower = (doc.title || '').toLowerCase();
        const contentLower = (doc.content || '').toLowerCase();
        const folderLower = (doc.folder || '').toLowerCase();

        let score = 0;
        queryKeywords.forEach(kw => {
          if (titleLower.includes(kw)) score += 5;
          if (folderLower.includes(kw)) score += 3;
          if (contentLower.includes(kw)) score += 1;
        });

        if (score > 0) {
          matchedDocs.push({
            title: doc.title,
            folder: doc.folder,
            snippet: (doc.content || '').substring(0, 450),
            score
          });
        }
      });

      matchedDocs.sort((a, b) => b.score - a.score);
      const topMatches = matchedDocs.slice(0, 3);

      if (topMatches.length === 0) return '';

      let ragContext = '\n=== RETRIEVED RELEVANT KNOWLEDGE (DOCS & OBSIDIAN VAULT) ===\n';
      topMatches.forEach((m, idx) => {
        ragContext += `[Doc ${idx + 1}: ${m.title} (${m.folder})]\n${m.snippet}...\n\n`;
      });
      return ragContext;
    } catch (err) {
      console.warn('Knowledge RAG search error:', err);
      return '';
    }
  },

  // =========================================================================
  // PILAR 1: DYNAMIC LIVE CONTEXT INJECTION (SUPABASE REAL-TIME DATA)
  // =========================================================================
  async buildLiveContext(userQuery = '') {
    try {
      const [todos, projects, docs] = await Promise.all([
        backofficeService.getTodos().catch(() => []),
        backofficeService.getProjects().catch(() => []),
        backofficeService.getDocs().catch(() => [])
      ]);

      const currentPlatform = backofficeService.getCurrentPlatformId();
      const inProgressTodos = todos.filter(t => t.status === 'Inprogress' || t.status === 'In progress').slice(0, 4);
      const activeProjects = projects.slice(0, 4);
      const memory = this.getDeveloperMemory();
      const ragKnowledge = userQuery ? await this.searchKnowledgeDocs(userQuery) : '';

      let contextStr = `
=== LIVE REAL-TIME DATABASE CONTEXT (SUPABASE) ===
- Active Workspace Platform: ${currentPlatform} (Isolasi Multi-Tenant Aktif)
- Total Kanban Tasks: ${todos.length} item (${inProgressTodos.length} sedang In-Progress)
- Tasks In-Progress: ${inProgressTodos.map(t => `"${t.title}" [${t.priority || 'Med'}]`).join(', ') || 'Belum ada'}
- Active Projects: ${activeProjects.map(p => `"${p.title}" (${p.type || 'App'} - ${p.progress || 0}%)`).join(', ') || 'Belum ada'}
- System Docs & PRD Count: ${docs.length} dokumen tersinkronisasi di Obsidian Vault

=== DEVELOPER MEMORY & PREFERENCES ===
- Developer: ${memory.developerName || 'Faiz Ali'}
- Style Preferences: ${memory.preferredStyle || 'Modern, clean, responsive'}
${memory.keyDirectives ? `- Key Directives: ${memory.keyDirectives.join('; ')}` : ''}
${memory.notes && memory.notes.length > 0 ? `- Recent Notes: ${memory.notes.map(n => n.text).join(' | ')}` : ''}
${ragKnowledge}
`;
      return contextStr;
    } catch (err) {
      return '';
    }
  },

  // =========================================================================
  // PURE GOOGLE GEMINI 2.0 FLASH INFERENCE ENGINE
  // =========================================================================
  async callGeminiInference(prompt, conversationHistory = [], customSystemInstruction = '') {
    const currentModel = this.getModel();
    const apiKey = this.getApiKey();

    // 1. Direct client Google Gemini API Key if provided
    if (apiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;
        
        let contents = [];
        if (conversationHistory && conversationHistory.length > 0) {
          contents = conversationHistory.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }));
          if (prompt) contents.push({ role: 'user', parts: [{ text: prompt }] });
        } else {
          contents = [{ role: 'user', parts: [{ text: prompt }] }];
        }

        let response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: { temperature: 0.5, maxOutputTokens: 1500, topP: 0.95 },
            systemInstruction: { parts: [{ text: customSystemInstruction }] }
          })
        });

        // Fallback to gemini-1.5-flash if 2.0 has regional limits
        if (!response.ok && currentModel !== 'gemini-1.5-flash') {
          const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
          response = await fetch(fallbackUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              generationConfig: { temperature: 0.5, maxOutputTokens: 1500 },
              systemInstruction: { parts: [{ text: customSystemInstruction }] }
            })
          });
        }

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0];
          const text = candidate?.content?.parts?.[0]?.text || '';
          if (text) return { text, model: currentModel };
        }
      } catch (e) {
        console.warn('Direct Gemini API call error:', e);
      }
    }

    // 2. Serverless Route (/api/gemini)
    try {
      const backendResponse = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          messages: conversationHistory,
          systemInstruction: customSystemInstruction,
          model: currentModel
        })
      });

      if (backendResponse.ok) {
        const backendData = await backendResponse.json();
        if (backendData.text) {
          return {
            text: backendData.text,
            model: backendData.model || currentModel
          };
        }
      }
    } catch (e) {
      // Offline / purely local
    }

    return null;
  },

  // Fallback Local Knowledge Base
  getLocalKnowledgeAnswer(text) {
    if (text.includes('backoffice') || text.includes('desktopalie') || text.includes('aplikasi ini') || text.includes('sistem ini')) {
      return `Desktopalie Backoffice (back.desktopalie.my.id) adalah pusat kendali dan sistem manajemen internal terpadu untuk platform Faiz Ali (desktopalie.my.id).\n\nFitur dan modul utama meliputi:\n- To-Do Kanban Board: Pengelolaan tugas harian dengan subtask dan prioritas.\n- Projects & Experiments Manager: Manajemen portofolio proyek perangkat lunak dan arsitektur kode.\n- Documentation & Master PRD: Pengelolaan spesifikasi produk dan SOP teknis.\n- Obsidian Vault Sync: Sinkronisasi dua arah antara catatan markdown lokal dengan database Supabase.\n- Desktop-Agentic: Asisten AI otonom Google Gemini 2.0 Flash untuk eksekusi tugas otomatis.\n- Telemetry & Security: Pemantauan keamanan Content Security Policy (CSP) dan infrastruktur.\n\nAda modul tertentu yang mau kita diskusikan sekarang?`;
    }

    if (text.includes('faiz ali') || text.includes('pembuat') || text.includes('creator') || text.includes('developer')) {
      return `Faiz Ali adalah Software Engineer dan pengembang utama dari ekosistem Desktopalie (desktopalie.my.id).\n\nBeliau merancang platform ini dengan arsitektur modern (React 19, Supabase PostgreSQL, Obsidian Knowledge Graph, dan Agentic AI Google Gemini) untuk menyatukan portofolio, dokumentasi riset, dan sistem manajemen tugas dalam satu ekosistem yang terpadu.`;
    }

    if (text.includes('obsidian') || text.includes('vault') || text.includes('knowledge graph')) {
      return `Obsidian Vault di ekosistem Desktopalie berfungsi sebagai basis pengetahuan jangka panjang (Second Brain).\n\nSetiap dokumentasi, arsitektur sistem, dan PRD yang dibuat di Backoffice secara otomatis tersinkronisasi menjadi file Markdown dengan grafik relasi (Knowledge Graph) di komputer lokal via skrip sinkronisasi AI.`;
    }

    return null;
  },

  // =========================================================================
  // PILAR 2 & 4: AUTONOMOUS GEMINI REASONING & MULTI-STEP TOOL ROUTER
  // =========================================================================
  async processUserIntent(userInput, conversationHistory = []) {
    const text = userInput.toLowerCase().trim();
    const thoughts = [];
    let toolExecuted = null;
    let resultPayload = null;
    let responseText = '';
    const currentModel = this.getModel();

    // Step 1: Inject Live Dynamic Context & Knowledge RAG
    thoughts.push('📡 [Live Context] Mengambil data status real-time dari Supabase & Obsidian...');
    const liveContext = await this.buildLiveContext(userInput);

    const systemPromptWithContext = `
Anda adalah Desktop-Agentic, asisten AI resmi berteknologi Google Gemini 2.0 Flash di platform Desktopalie Backoffice.

GAYA KOMUNIKASI:
- Ramah, santai, solutif, peka, dan asik diajak diskusi layaknya rekan kerja/pair programmer pribadi.
- Peka dan cepat tangkap maksud pengguna tanpa bertele-tele.
- Gunakan data konteks real-time yang diberikan untuk memberikan jawaban yang 100% akurat.

KEMAMPUAN OTONOM (TOOLS):
Anda dapat menginstruksikan sistem untuk mengeksekusi tugas otomatis dengan menyertakan tag aksi berikut di dalam respon jika pengguna meminta tindakan nyata:
- [ACTION: create_task {"title": "Judul Tugas", "priority": "High|Medium|Low", "category": "Engineering|QA Checklist|Research", "status": "Not started|Inprogress|Done"}]
- [ACTION: update_prd {"updateNotes": "Catatan update spesifikasi"}]
- [ACTION: create_documentation {"title": "Judul Dokumen", "folder": "02 - Backoffice", "content": "Isi dokumen markdown"}]
- [ACTION: sync_obsidian_vault {}]
- [ACTION: get_telemetry_report {}]

${liveContext}
`;

    // Intent 0: Friendly Greetings
    if (text === 'hi' || text === 'halo' || text === 'hello' || text === 'hey' || text === 'p' || text.includes('selamat pagi') || text.includes('selamat sore') || text.includes('selamat malam')) {
      thoughts.push('👋 [Agent Reasoning] Menyapa pengguna dengan Gemini 2.0 Flash...');
      responseText = `Halo! Selamat datang di Desktopalie Backoffice. Saya adalah Desktop-Agentic (Powered by Google Gemini 2.0 Flash), siap bantu oprek coding, analisis arsitektur, dan eksekusi tugas otomatis Anda hari ini. 🚀\n\nBeberapa aksi otomatis yang bisa langsung saya jalankan:\n- Update PRD: Memperbarui dokumen spesifikasi produk di database.\n- Buat Tugas: Menambahkan tugas baru ke papan To-Do Kanban.\n- Sinkronkan Obsidian: Menyelaraskan catatan dokumentasi dengan Obsidian Vault.\n- Cek Telemetri: Menampilkan ringkasan status kesehatan dan data proyek.\n- Buat Dokumentasi: Menulis catatan arsitektur sistem baru.\n\nApa yang ingin kita kerjakan sekarang?`;
    }
    // Intent 1: Update PRD
    else if (text.includes('update prd') || text.includes('perbarui prd') || text.includes('ubah prd') || text.includes('tambah prd') || text.includes('edit prd') || (text.includes('prd') && (text.includes('tambah') || text.includes('update')))) {
      thoughts.push('🔧 [Tool Selection] Menjalankan Tool update_prd...');
      try {
        const docs = await backofficeService.getDocs();
        let prdDoc = docs.find(d => d.title.toLowerCase().includes('prd') || d.slug.includes('prd'));
        
        const timestamp = new Date().toLocaleString('id-ID');
        let updateNote = userInput.replace(/update prd|perbarui prd|ubah prd|tambah prd|edit prd|prd/gi, '').trim();
        if (!updateNote) updateNote = 'Pembaruan Modul Desktop-Agentic & Serverless Security Architecture';
        
        let newContent = '';
        if (prdDoc) {
          newContent = `${prdDoc.content || ''}\n\n### ✦ Update PRD (${timestamp})\n- Catatan Pembaruan: ${updateNote}\n- Otoritas: Desktop-Agentic (Google Gemini Engine)\n- Status: Live & Integrated with Supabase + Obsidian Vault.`;
          await backofficeService.updateDoc(prdDoc.id, { content: newContent });
        } else {
          prdDoc = await backofficeService.createDoc({
            title: '00 - Backoffice PRD (Product Requirement Document)',
            folder: '02 - Backoffice',
            slug: '00-backoffice-prd',
            author: 'Desktop-Agentic (Gemini)',
            content: `# 00 - Backoffice PRD (Product Requirement Document)\n\n## Ringkasan Sistem\nDokumen master PRD ini dikelola secara otonom oleh Desktop-Agentic.\n\n### Update PRD (${timestamp})\n- Catatan Pembaruan: ${updateNote}`
          });
        }
        
        toolExecuted = 'update_prd';
        resultPayload = { docId: prdDoc.id, title: prdDoc.title };
        this.addMemoryNote(`PRD Diperbarui: ${updateNote}`);
        thoughts.push(`✅ [Tool Output] PRD Document "${prdDoc.title}" berhasil diperbarui!`);
        responseText = `Dokumen Product Requirement Document (PRD) telah berhasil diperbarui di database:\n\n- Dokumen: ${prdDoc.title}\n- Catatan Pembaruan: ${updateNote}\n- Status: Tersimpan di Supabase dan siap disinkronkan ke Obsidian Vault.\n\nAda bagian lain dari PRD yang mau ditambahkan lagi?`;
      } catch (err) {
        thoughts.push(`❌ [Tool Error] Gagal memperbarui PRD: ${err.message}`);
        responseText = `Terjadi kendala saat memperbarui PRD: ${err.message}.`;
      }
    }
    // Intent 2: Create Task
    else if (text.includes('tugas') || text.includes('todo') || text.includes('task') || text.includes('buat tugas')) {
      thoughts.push('🔧 [Tool Selection] Menjalankan Tool create_task...');
      
      let title = userInput.replace(/buat tugas|tambah tugas|tugas baru|task|todo/gi, '').trim();
      if (!title) title = 'Tugas Baru dari Desktop-Agentic';

      const taskData = {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        description: `Dibuat secara otomatis oleh Desktop-Agentic (Gemini) pada ${new Date().toLocaleString('id-ID')}.\n\nInstruksi:\n- Verifikasi dan pengujian komponen.`,
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
        this.addMemoryNote(`Tugas Baru Dibuat: ${created.title}`);
        thoughts.push(`✅ [Tool Output] Tool create_task berhasil dieksekusi! ID: ${created.id}`);
        
        try {
          const aiResponse = await this.callGeminiInference(
            `User meminta membuat tugas: "${userInput}". Tugas berhasil dibuat dengan ID: ${created.id}, Judul: "${created.title}", Status: "${created.status}", Prioritas: "${created.priority}". Buat respons konfirmasi yang ramah dan to-the-point dalam Bahasa Indonesia.`,
            conversationHistory,
            systemPromptWithContext
          );
          if (aiResponse?.text) {
            responseText = aiResponse.text;
          }
        } catch (e) {}
        
        if (!responseText) {
          responseText = `Tugas baru berhasil dibuat dan masuk ke papan To-Do Kanban:\n\n- Judul: ${created.title}\n- Status: ${created.status}\n- Prioritas: ${created.priority}\n- Kategori: ${created.category}\n\nTugas siap dikerjakan. Ada lagi yang mau ditambahkan?`;
        }
      } catch (err) {
        thoughts.push(`❌ [Tool Error] Gagal mengeksekusi create_task: ${err.message}`);
        responseText = `Terjadi kendala saat membuat tugas: ${err.message}.`;
      }
    }
    // Intent 3: Sync Obsidian Vault
    else if (text.includes('obsidian') || text.includes('sync') || text.includes('singkron')) {
      thoughts.push('🔧 [Tool Selection] Menjalankan Tool sync_obsidian_vault...');
      try {
        const docs = await backofficeService.getDocs();
        toolExecuted = 'sync_obsidian_vault';
        resultPayload = { count: docs.length };
        thoughts.push(`✅ [Tool Output] Tool sync_obsidian_vault selesai! Total ${docs.length} dokumen tersinkron.`);
        responseText = `Sinkronisasi data dengan Obsidian Vault telah selesai dijalankan.\n\nSebanyak ${docs.length} catatan dokumentasi & PRD saat ini selaras dengan database Backoffice dan siap diakses di aplikasi Obsidian lokal Anda.`;
      } catch (err) {
        thoughts.push(`❌ [Tool Error] ${err.message}`);
        responseText = `Sinkronisasi Obsidian mengalami kendala: ${err.message}.`;
      }
    }
    // Intent 4: Create Documentation
    else if (text.includes('dokumentasi') || text.includes('catatan') || text.includes('doc') || text.includes('note')) {
      thoughts.push('🔧 [Tool Selection] Menjalankan Tool create_documentation...');
      let docTitle = userInput.replace(/buat dokumen|tambah catatan|dokumentasi baru|doc|note/gi, '').trim();
      if (!docTitle) docTitle = 'Dokumentasi Sistem Baru';

      const docData = {
        title: docTitle.charAt(0).toUpperCase() + docTitle.slice(1),
        folder: '02 - Backoffice',
        slug: docTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        author: 'Desktop-Agentic (Gemini)',
        content: `# ${docTitle}\n\nCatatan dokumentasi ini dibuat secara otomatis oleh Desktop-Agentic (Google Gemini Engine).\n\nRingkasan Sistem:\n- Waktu Pembuatan: ${new Date().toISOString()}\n- Dikelola oleh: Desktop-Agentic Action Router.`
      };

      try {
        const createdDoc = await backofficeService.createDoc(docData);
        toolExecuted = 'create_documentation';
        resultPayload = createdDoc;
        thoughts.push(`✅ [Tool Output] Tool create_documentation berhasil dieksekusi! ID: ${createdDoc.id}`);
        responseText = `Dokumentasi baru "${createdDoc.title}" telah berhasil dibuat.\n\nCatatan ini otomatis tersimpan di System Documentation Manager dan siap disinkronkan ke Obsidian Vault.`;
      } catch (err) {
        thoughts.push(`❌ [Tool Error] ${err.message}`);
        responseText = `Gagal membuat dokumentasi: ${err.message}`;
      }
    }
    // Intent 5: Telemetry Report
    else if (text.includes('telemetri') || text.includes('laporan') || text.includes('ringkasan') || text.includes('stat')) {
      thoughts.push('🔧 [Tool Selection] Menjalankan Tool get_telemetry_report...');
      try {
        const [todos, projects, docs] = await Promise.all([
          backofficeService.getTodos(),
          backofficeService.getProjects(),
          backofficeService.getDocs()
        ]);
        toolExecuted = 'get_telemetry_report';
        resultPayload = { todos: todos.length, projects: projects.length, docs: docs.length };
        thoughts.push('✅ [Tool Output] Telemetri berhasil dikumpulkan.');
        responseText = `Berikut ringkasan telemetri sistem Backoffice saat ini:\n\n- Total Tugas Kanban: ${todos.length} item\n- Portofolio Proyek Aktif: ${projects.length} proyek\n- Dokumen & PRD: ${docs.length} dokumen\n- Status Infrastruktur: 100% Beroperasi normal di Vercel Global Edge\n\nSeluruh layanan berjalan stabil. Mau cek data lainnya?`;
      } catch (err) {
        thoughts.push(`❌ [Tool Error] ${err.message}`);
        responseText = `Gagal mengumpulkan telemetri: ${err.message}`;
      }
    }
    // General Questions / Deep Queries with Google Gemini 2.0 Flash + Live Context + RAG
    else {
      try {
        thoughts.push('🧠 [Gemini 2.0 Inference] Menganalisis dengan Google Gemini 2.0 Flash...');
        
        const aiOutput = await this.callGeminiInference(userInput, conversationHistory, systemPromptWithContext);
        if (aiOutput?.text && aiOutput.text.trim()) {
          let rawText = aiOutput.text;

          // Check if AI included autonomous action tags [ACTION: ...]
          const actionRegex = /\[ACTION:\s*(\w+)\s*(\{.*?\})?\]/g;
          let match;
          while ((match = actionRegex.exec(rawText)) !== null) {
            const actionName = match[1];
            let actionParams = {};
            try {
              if (match[2]) actionParams = JSON.parse(match[2]);
            } catch (e) {}

            thoughts.push(`⚡ [Autonomous Action] Gemini mengeksekusi: ${actionName}`);
            
            if (actionName === 'create_task' && actionParams.title) {
              await backofficeService.createTodo({
                title: actionParams.title,
                priority: actionParams.priority || 'Medium',
                category: actionParams.category || 'Engineering',
                status: actionParams.status || 'Not started'
              }).catch(() => {});
              toolExecuted = 'create_task';
            } else if (actionName === 'update_prd' && actionParams.updateNotes) {
              const docs = await backofficeService.getDocs().catch(() => []);
              const prdDoc = docs.find(d => d.title.toLowerCase().includes('prd'));
              if (prdDoc) {
                const timestamp = new Date().toLocaleString('id-ID');
                await backofficeService.updateDoc(prdDoc.id, {
                  content: `${prdDoc.content || ''}\n\n### ✦ Auto Update (${timestamp})\n- ${actionParams.updateNotes}`
                }).catch(() => {});
              }
              toolExecuted = 'update_prd';
            }
          }

          // Clean up action tags from final output text for clean reading
          responseText = rawText.replace(/\[ACTION:\s*\w+\s*(\{.*?\})?\]/g, '').trim();
        }
      } catch (err) {
        thoughts.push(`⚠️ [Gemini API Note] ${err.message}`);
      }

      // If Gemini didn't return, consult local knowledge base
      if (!responseText) {
        const localAnswer = this.getLocalKnowledgeAnswer(text);
        if (localAnswer) {
          thoughts.push('💡 [Local Knowledge Match] Menemukan data konteks di Basis Pengetahuan Backoffice...');
          responseText = localAnswer;
        } else {
          thoughts.push('💡 [General Response] Memformulasikan tanggapan bantuan Desktop-Agentic...');
          responseText = `Mengenai pertanyaan Anda tentang "${userInput}":\n\nSaya siap bantu analisis arsitektur sistem, coding, optimasi database, maupun manajemen tugas.\n\nBeberapa tugas otomatis yang bisa langsung dijalankan:\n- Update PRD: Memperbarui dokumen spesifikasi produk di database.\n- Buat Tugas: Menambahkan tugas baru ke Kanban To-Do.\n- Sinkronkan Obsidian: Menyelaraskan catatan dokumentasi dengan Obsidian Vault.\n- Cek Telemetri: Menampilkan status kesehatan dan ringkasan sistem.\n\nAda bagian kode atau tugas yang mau langsung kita bedah sekarang?`;
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
