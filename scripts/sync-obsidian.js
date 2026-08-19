import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default Obsidian Vault Path
const DEFAULT_OBSIDIAN_VAULT = 'C:\\Users\\Cerebrum\\Documents\\Obsidian Vault\\Desktopalie Workspace';

// Load env variables manually from .env if needed
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split(/\r?\n/).forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nxuumfzpmvolcnswfsqz.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tanzxiYEr3IaD8IrGk4zFA_6HintxTJ';
const supabase = createClient(supabaseUrl, supabaseKey);

const vaultPath = process.env.OBSIDIAN_VAULT_PATH || DEFAULT_OBSIDIAN_VAULT;

console.log('✦ Desktopalie — Obsidian Vault Sync Utility');
console.log(`📍 Target Vault Directory: ${vaultPath}`);

// Helper: Parse YAML Frontmatter
function parseMarkdownWithFrontmatter(fileContent) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content: fileContent.trim() };
  }

  const yamlBlock = match[1];
  const content = match[2].trim();
  const metadata = {};

  yamlBlock.split(/\r?\n/).forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.substring(0, colonIdx).trim();
      let value = line.substring(colonIdx + 1).trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim());
      }
      metadata[key] = value;
    }
  });

  return { metadata, content };
}

// Helper: Format YAML Frontmatter for export
function formatMarkdownWithFrontmatter(metadata, content) {
  let yaml = '---\n';
  Object.keys(metadata).forEach(key => {
    const val = metadata[key];
    if (Array.isArray(val)) {
      yaml += `${key}:\n${val.map(v => `  - ${v}`).join('\n')}\n`;
    } else {
      yaml += `${key}: ${val}\n`;
    }
  });
  yaml += '---\n\n';
  return yaml + content;
}

// 1. IMPORT FROM OBSIDIAN VAULT TO SUPABASE & SITE SETTINGS
async function importFromObsidian() {
  if (!fs.existsSync(vaultPath)) {
    console.error(`❌ Vault path non-existent: ${vaultPath}`);
    return;
  }

  console.log('\n📥 Step 1: Scanning & Importing Markdown files from Obsidian Vault...');

  const itemsImported = [];

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (file.endsWith('.md')) {
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        const relativeFolder = path.relative(vaultPath, path.dirname(fullPath));
        const { metadata, content } = parseMarkdownWithFrontmatter(fileContent);

        const title = metadata.title || path.basename(file, '.md').replace(/^\d+\s*-\s*/, '');
        const folder = relativeFolder === '' ? 'Core' : relativeFolder;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        itemsImported.push({
          id: `obsidian-${slug}`,
          fullPath,
          fileName: file,
          title,
          folder,
          slug,
          author: metadata.author || 'Faiz Ali (Obsidian)',
          content,
          tags: Array.isArray(metadata.tags) ? metadata.tags : (metadata.tags ? [metadata.tags] : []),
          created_at: metadata.created ? new Date(metadata.created).toISOString() : new Date().toISOString(),
          platform_id: 'platform1'
        });
      }
    }
  }

  walkDir(vaultPath);

  console.log(` Found ${itemsImported.length} Obsidian markdown notes.`);

  // Save to site_settings (obsidian_vault_docs) as central JSON store in Supabase
  try {
    const { error: settingsError } = await supabase
      .from('site_settings')
      .upsert({
        key: 'obsidian_vault_docs',
        value: {
          vault_path: vaultPath,
          synced_at: new Date().toISOString(),
          total_items: itemsImported.length,
          items: itemsImported.map(item => ({
            id: item.id,
            title: item.title,
            folder: item.folder,
            slug: item.slug,
            author: item.author,
            content: item.content,
            tags: item.tags,
            created_at: item.created_at,
            platform_id: item.platform_id
          }))
        },
        updated_at: new Date().toISOString()
      });

    if (!settingsError) {
      console.log(`  ✓ Successfully stored all ${itemsImported.length} Obsidian notes into Supabase 'site_settings' (key: obsidian_vault_docs)!`);
    } else {
      console.warn(`  ⚠️ Could not update site_settings:`, settingsError.message);
    }
  } catch (err) {
    console.warn(`  ⚠️ Exception saving to site_settings:`, err.message);
  }

  // Save local JSON backup for offline Backoffice
  const localBackupPath = path.resolve(__dirname, '../src/config/obsidian_vault_data.json');
  fs.writeFileSync(localBackupPath, JSON.stringify(itemsImported, null, 2), 'utf-8');
  console.log(`  ✓ Local backup generated at src/config/obsidian_vault_data.json`);

  console.log(`\n Total Synced: ${itemsImported.length} notes processed.`);
}

// 2. EXPORT FROM SUPABASE TO OBSIDIAN VAULT
async function exportToObsidian() {
  console.log('\n📤 Step 2: Fetching Documentation & Notes and Syncing to Obsidian Vault...');

  try {
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'obsidian_vault_docs')
      .single();

    if (settingsData && settingsData.value && settingsData.value.items) {
      const items = settingsData.value.items;
      console.log(` Exporting ${items.length} items to Obsidian Vault...`);

      items.forEach(doc => {
        const folderName = doc.folder || 'Core';
        const targetDir = path.join(vaultPath, folderName);

        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        const fileName = `${doc.title.replace(/[/\\?%*:|"<>]/g, '-')}.md`;
        const filePath = path.join(targetDir, fileName);

        const metadata = {
          title: doc.title,
          folder: doc.folder,
          author: doc.author || 'Desktopalie Backoffice',
          slug: doc.slug,
          created: doc.created_at ? doc.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          platform_id: doc.platform_id || 'platform1'
        };

        const mdContent = formatMarkdownWithFrontmatter(metadata, doc.content || '');
        fs.writeFileSync(filePath, mdContent, 'utf-8');
      });

      console.log(' Export to Obsidian Vault completed!');
    }
  } catch (err) {
    console.error(' Exception during export:', err.message);
  }
}

// 3. WATCH MODE: MONITOR VAULT CHANGES REAL-TIME
async function watchObsidian() {
  console.log(`\n👀 Step 3: Starting Real-Time Watcher on Vault: ${vaultPath}`);
  console.log('   (Every save or edit in Obsidian Desktop will auto-sync to Backoffice!)\n');

  await importFromObsidian();

  let timeoutId = null;
  fs.watch(vaultPath, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.md')) {
      console.log(`⚡ Change detected in Obsidian note [${eventType}]: ${filename}`);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        console.log('🔄 Triggering auto-sync...');
        await importFromObsidian();
      }, 500);
    }
  });
}

// MAIN EXECUTION
const mode = process.argv[2] || 'sync';

(async () => {
  if (mode === 'import') {
    await importFromObsidian();
  } else if (mode === 'export') {
    await exportToObsidian();
  } else if (mode === 'watch') {
    await watchObsidian();
  } else {
    await importFromObsidian();
    await exportToObsidian();
  }
  if (mode !== 'watch') {
    console.log('\n Obsidian Vault Connection finished cleanly!');
  }
})();
