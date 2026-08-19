import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_OBSIDIAN_VAULT = 'C:\\Users\\Cerebrum\\Documents\\Obsidian Vault\\Desktopalie Workspace';
const vaultPath = process.env.OBSIDIAN_VAULT_PATH || DEFAULT_OBSIDIAN_VAULT;

console.log('================================================================');
console.log(' 🧠 DESKTOPALIE OBSIDIAN AI KNOWLEDGE & GRAPH INTELLIGENCE ENGINE');
console.log('================================================================');
console.log(`📍 Vault Directory: ${vaultPath}\n`);

if (!fs.existsSync(vaultPath)) {
  console.error(`❌ Vault directory not found: ${vaultPath}`);
  process.exit(1);
}

// Technical Keyword Taxonomy Dictionary for AI Auto-Tagging
const TAXONOMY_RULES = [
  { tag: 'architecture', keywords: ['architecture', 'layer', 'system', 'structure', 'arsitektur', 'skema', '13-layer'] },
  { tag: 'frontend', keywords: ['react', 'vite', 'component', 'ui', 'ux', 'css', 'tailwind', 'spa', 'jsx', 'frontend'] },
  { tag: 'backend', keywords: ['api', 'service', 'crud', 'supabase', 'endpoint', 'rest', 'websocket', 'realtime'] },
  { tag: 'database', keywords: ['database', 'postgresql', 'table', 'jsonb', 'schema', 'sql', 'tabel', 'supabase'] },
  { tag: 'security', keywords: ['security', 'rls', 'auth', 'pkce', 'jwt', 'csp', 'hsts', 'xss', 'waf', 'rate limit', 'keamanan'] },
  { tag: 'deployment', keywords: ['vercel', 'cloudflare', 'deployment', 'hosting', 'cdn', 'ci/cd', 'git', 'github', 'domain'] },
  { tag: 'flavoring', keywords: ['flavor', 'multi-platform', 'white-label', 'platform1', 'platform2', 'platform3', 'platform4'] },
  { tag: 'prd', keywords: ['prd', 'product requirement', 'specification', 'spesifikasi', 'requirement'] }
];

function getMarkdownFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== '.obsidian' && file !== '.git') {
        results = results.concat(getMarkdownFiles(filePath));
      }
    } else if (file.endsWith('.md')) {
      results.push(filePath);
    }
  }
  return results;
}

// Helper: Extract Frontmatter & Body
function parseMarkdown(content) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatterStr: '', frontmatter: {}, body: content };
  }

  const yamlBlock = match[1];
  const body = match[2];
  const frontmatter = {};

  yamlBlock.split(/\r?\n/).forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.substring(0, colonIdx).trim();
      let val = line.substring(colonIdx + 1).trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map(s => s.trim());
      }
      frontmatter[key] = val;
    }
  });

  return { frontmatterStr: yamlBlock, frontmatter, body };
}

// Tokenize text for semantic similarity
function tokenize(text) {
  return text.toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3);
}

// Calculate Jaccard Similarity between two token sets
function calculateSimilarity(tokensA, tokensB) {
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

async function runIntelligenceEngine() {
  const filePaths = getMarkdownFiles(vaultPath);
  console.log(`🔍 Step 1: Analyzing ${filePaths.length} Markdown Notes in Vault...`);

  const notesData = [];
  const globalTasks = [];

  // Parse all notes
  filePaths.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, body } = parseMarkdown(content);
    const fileName = path.basename(filePath);
    const title = frontmatter.title || fileName.replace('.md', '');
    const relativePath = path.relative(vaultPath, filePath);
    const tokens = tokenize(`${title} ${body}`);

    // Scan for open tasks (- [ ])
    const taskLines = body.split(/\r?\n/).filter(line => line.trim().startsWith('- [ ]') || line.trim().startsWith('- [x]'));
    taskLines.forEach(taskLine => {
      globalTasks.push({
        noteTitle: title,
        notePath: relativePath,
        task: taskLine.trim()
      });
    });

    notesData.push({
      filePath,
      fileName,
      relativePath,
      title,
      frontmatter,
      body,
      tokens,
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : (frontmatter.tags ? [frontmatter.tags] : [])
    });
  });

  console.log(`  ✓ Tokenization & Task Extraction complete (${globalTasks.length} tasks identified across Vault).`);

  // Step 2: Auto-Tagging & AI Classification
  console.log('\n🏷️ Step 2: Running AI Auto-Tagging Engine...');
  let updatedTagCount = 0;

  notesData.forEach(note => {
    const fullText = `${note.title} ${note.body}`.toLowerCase();
    const suggestedTags = new Set(note.tags);

    TAXONOMY_RULES.forEach(rule => {
      if (rule.keywords.some(kw => fullText.includes(kw))) {
        suggestedTags.add(rule.tag);
      }
    });

    const newTagsList = Array.from(suggestedTags);
    if (newTagsList.length > note.tags.length) {
      updatedTagCount++;
      note.tags = newTagsList;
    }
  });

  console.log(`  ✓ AI Auto-Tagging assigned smart taxonomy tags to ${updatedTagCount} notes.`);

  // Step 3: Semantic Connection Engine (Auto-linking related Wikilinks)
  console.log('\n🧠 Step 3: Generating AI Knowledge Graph Connections (Semantic Wikilinks)...');
  let totalConnectionsAdded = 0;

  notesData.forEach((note, idx) => {
    // Exclude MOC / Index files from having auto-generated section appended
    if (note.fileName.includes('Index') || note.fileName.includes('MOC') || note.fileName.includes('Executive')) return;

    const similarities = [];
    notesData.forEach((otherNote, otherIdx) => {
      if (idx !== otherIdx && !otherNote.fileName.includes('Index') && !otherNote.fileName.includes('MOC')) {
        const score = calculateSimilarity(note.tokens, otherNote.tokens);
        if (score > 0.08) {
          similarities.push({ note: otherNote, score });
        }
      }
    });

    similarities.sort((a, b) => b.score - a.score);
    const topRelated = similarities.slice(0, 3);

    if (topRelated.length > 0) {
      // Check if note already has "AI Suggested Graph Connections" section
      let newBody = note.body;
      const aiSectionHeader = '## 🧠 AI Suggested Graph Connections';
      
      const connectionLinks = topRelated.map(rel => {
        const cleanName = rel.note.fileName.replace('.md', '');
        return `- [[${cleanName}]] — *(Semantic Match: ${Math.round(rel.score * 100)}%)*`;
      }).join('\n');

      const aiBlockContent = `${aiSectionHeader}\n> [!AI-INSIGHT] AI Semantic Engine automatically connected this note to related architecture nodes:\n${connectionLinks}\n`;

      if (newBody.includes(aiSectionHeader)) {
        const regex = new RegExp(`${aiSectionHeader}[\\s\\S]*?(?=(\\n## |$))`);
        newBody = newBody.replace(regex, aiBlockContent);
      } else {
        newBody = `${newBody.trim()}\n\n---\n\n${aiBlockContent}`;
      }

      // Reconstruct file with updated frontmatter & body
      let tagsYaml = note.tags.length > 0 ? `tags:\n${note.tags.map(t => `  - ${t}`).join('\n')}\n` : '';
      let yamlBlock = '---\n';
      yamlBlock += `title: "${note.title}"\n`;
      if (note.frontmatter.folder) yamlBlock += `folder: "${note.frontmatter.folder}"\n`;
      if (note.frontmatter.author) yamlBlock += `author: "${note.frontmatter.author}"\n`;
      yamlBlock += `created: ${note.frontmatter.created || '2026-08-19'}\n`;
      yamlBlock += tagsYaml;
      yamlBlock += '---\n\n';

      const finalMarkdown = yamlBlock + newBody;
      fs.writeFileSync(note.filePath, finalMarkdown, 'utf-8');
      totalConnectionsAdded += topRelated.length;
    }
  });

  console.log(`  ✓ Successfully injected ${totalConnectionsAdded} AI Semantic Wikilink connections into Graph View!`);

  // Step 4: Generate Executive Dashboard & Action Item Note
  console.log('\n📊 Step 4: Generating AI Master Knowledge & Executive Dashboard Note...');
  const dashboardPath = path.join(vaultPath, '00 - AI Knowledge Graph & Executive Dashboard.md');

  const openTasks = globalTasks.filter(t => t.task.startsWith('- [ ]'));
  const completedTasks = globalTasks.filter(t => t.task.startsWith('- [x]'));
  const completionRate = globalTasks.length > 0 ? Math.round((completedTasks.length / globalTasks.length) * 100) : 100;

  let dashboardMarkdown = `---
title: "AI Knowledge Graph & Executive Dashboard"
tags:
  - ai-dashboard
  - telemetry
  - graph-intelligence
  - executive-summary
created: 2026-08-19
author: "AI Knowledge Intelligence Engine"
---

# 🧠 Desktopalie Workspace — AI Knowledge Graph & Executive Telemetry

> [!AI-SUMMARY] Executive Overview
> Engine AI Obsidian telah memproses seluruh **${notesData.length} Catatan Arsitektur**, membentuk **${totalConnectionsAdded} Wikilink Koneksi Otomatis**, dan mengekstrak **${globalTasks.length} Item Tugas QA/Sprint** dari seluruh Vault.

---

## 📈 1. Telemetry & Telemetri Vault

| Metric | Nilai Status | Catatan Evaluasi |
| :--- | :--- | :--- |
| **Total Notes in Vault** | **${notesData.length} Catatan** | Terkompilasi dalam Obsidian Vault |
| **AI Wikilink Connections** | **${totalConnectionsAdded} Links** | Keterhubungan Node Graph View |
| **Action Items Identified** | **${globalTasks.length} Items** | Extracted Task Checklists |
| **Sprint Progress** | **${completionRate}% Selesai** | (${completedTasks.length}/${globalTasks.length} Tugas Selesai) |

---

## 🎯 2. Papan Tugas Terpusat (Global Action Item Board)

### 📌 Tugas Aktif (Open Tasks - ${openTasks.length}):
${openTasks.length === 0 ? '_Seluruh tugas sprint telah berhasil diselesaikan!_' : openTasks.slice(0, 15).map(t => `- ${t.task} *(Ref: [[${t.noteTitle}]])*`).join('\n')}

### ✅ Tugas Selesai (Completed - ${completedTasks.length}):
${completedTasks.slice(0, 10).map(t => `- ${t.task} *(Ref: [[${t.noteTitle}]])*`).join('\n')}

---

## 🕸️ 3. Node Utama Arsitektur Sistem
${notesData.map(n => `- [[${n.fileName.replace('.md', '')}]] — _Tags: ${n.tags.map(t => `#${t}`).join(' ')}_`).join('\n')}

---

© 2026 Desktopalie AI Knowledge Engine. Auto-generated and updated.
`;

  fs.writeFileSync(dashboardPath, dashboardMarkdown, 'utf-8');
  console.log(`  ✓ Master Note created: 00 - AI Knowledge Graph & Executive Dashboard.md`);

  console.log('\n================================================================');
  console.log(' 🎉 OBSIDIAN AI KNOWLEDGE & GRAPH INTELLIGENCE SUCCESSFUL!');
  console.log('================================================================\n');
}

runIntelligenceEngine();
