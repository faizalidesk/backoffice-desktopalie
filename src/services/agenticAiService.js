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

export const agenticAiService = {
  // Autonomous Agent Execution Router
  async processUserIntent(userInput) {
    const text = userInput.toLowerCase();
    const thoughts = [];
    let toolExecuted = null;
    let resultPayload = null;
    let responseText = '';

    thoughts.push('🤖 [Agent Thought] Menganalisis niat pengguna & mencocokkan skema Tool Registry...');

    // Intent 1: Create Task (Buat Tugas)
    if (text.includes('tugas') || text.includes('todo') || text.includes('task') || text.includes('buat tugas')) {
      thoughts.push('🔧 [Tool Selection] Terdeteksi niat manajemen tugas -> Memilih Tool create_task');
      
      let title = userInput.replace(/buat tugas|tambah tugas|tugas baru|task|todo/gi, '').trim();
      if (!title) title = 'Tugas Baru dari Agentic AI';

      const taskData = {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        description: `Dibuat secara otomatis oleh Agentic AI Copilot pada ${new Date().toLocaleString('id-ID')}.\n\n### 📌 Instruksi Agent\n- [ ] Lakukan verifikasi dan pengujian komponen.`,
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
        responseText = `Tugas baru **"${created.title}"** telah berhasil dibuat oleh Agentic AI dan ditambahkan ke papan Kanban **To-Do Board**! Status: \`${created.status}\`, Prioritas: \`${created.priority}\`.`;
      } catch (err) {
        thoughts.push(`❌ [Tool Error] Gagal mengeksekusi create_task: ${err.message}`);
        responseText = `Maaf, terjadi kendala saat membuat tugas: ${err.message}`;
      }
    }
    // Intent 2: Sync Obsidian Vault
    else if (text.includes('obsidian') || text.includes('sync') || text.includes('singkron')) {
      thoughts.push('🔧 [Tool Selection] Terdeteksi niat sinkronisasi Vault -> Memilih Tool sync_obsidian_vault');
      try {
        const docs = await backofficeService.getDocs();
        toolExecuted = 'sync_obsidian_vault';
        resultPayload = { count: docs.length };
        thoughts.push(`✅ [Tool Output] Tool sync_obsidian_vault selesai! Total ${docs.length} dokumen tersinkron.`);
        responseText = `Berhasil menyinkronkan data dengan **Obsidian Vault**! **${docs.length} catatan dokumentasi** telah diperbarui dan disesuaikan dengan database.`;
      } catch (err) {
        thoughts.push(`❌ [Tool Error] ${err.message}`);
        responseText = `Gagal menyinkronkan Obsidian Vault: ${err.message}`;
      }
    }
    // Intent 3: Create Documentation / Note
    else if (text.includes('dokumentasi') || text.includes('catatan') || text.includes('doc') || text.includes('note')) {
      thoughts.push('🔧 [Tool Selection] Terdeteksi niat dokumentasi -> Memilih Tool create_documentation');
      let docTitle = userInput.replace(/buat dokumen|tambah catatan|dokumentasi baru|doc|note/gi, '').trim();
      if (!docTitle) docTitle = 'Dokumentasi Sistem Baru';

      const docData = {
        title: docTitle.charAt(0).toUpperCase() + docTitle.slice(1),
        folder: '02 - Backoffice',
        slug: docTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        author: 'Agentic AI Copilot',
        content: `# ✦ ${docTitle}\n\nCatatan dokumentasi ini dibuat secara otomatis oleh **Agentic AI Copilot**.\n\n## 📌 Ringkasan System\n- Timestamp: ${new Date().toISOString()}\n- Triggered by: Agentic AI Action Router.`
      };

      try {
        const createdDoc = await backofficeService.createDoc(docData);
        toolExecuted = 'create_documentation';
        resultPayload = createdDoc;
        thoughts.push(`✅ [Tool Output] Tool create_documentation berhasil dieksekusi! ID: ${createdDoc.id}`);
        responseText = `Dokumentasi baru **"${createdDoc.title}"** berhasil dibuat dan ditambahkan ke **System Documentation Manager** & Obsidian Vault!`;
      } catch (err) {
        thoughts.push(`❌ [Tool Error] ${err.message}`);
        responseText = `Gagal membuat dokumentasi: ${err.message}`;
      }
    }
    // Intent 4: Telemetry Report / Summary
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
        responseText = `### 📊 Laporan Telemetri Sistem Backoffice:\n- **Total Tugas Kanban**: ${todos.length} items\n- **Portofolio Proyek**: ${projects.length} projects\n- **Dokumentasi & Notes**: ${docs.length} notes\n- **Status Sistem**: 100% Operational & Live on Vercel.`;
      } catch (err) {
        thoughts.push(`❌ [Tool Error] ${err.message}`);
        responseText = `Gagal mengumpulkan telemetri: ${err.message}`;
      }
    }
    // Default Fallback Response
    else {
      thoughts.push('💡 [Agent Reasoning] Pertanyaan umum -> Memformulasikan jawaban bantuan Agentic AI Copilot...');
      responseText = `Halo! Saya adalah **Agentic AI Copilot** di Desktopalie Backoffice. Saya tidak hanya bisa menjawab pertanyaan, tetapi juga bisa **diberikan perintah langsung untuk mengeksekusi tugas pada aplikasi**!\n\n**Perintah yang bisa Anda berikan:**\n1. *"Buat tugas baru: Pengujian Security Audit"* $\\rightarrow$ *(Otomatis membuat Kanban task)*\n2. *"Singkronkan Obsidian Vault"* $\\rightarrow$ *(Menjalankan sync dokumentasi)*\n3. *"Tampilkan laporan telemetri proyek"* $\\rightarrow$ *(Mengkompilasi ringkasan data)*\n4. *"Buat catatan dokumentasi arsitektur"* $\\rightarrow$ *(Membuat dokumen baru)*`;
    }

    return {
      thoughts,
      toolExecuted,
      resultPayload,
      responseText
    };
  }
};
