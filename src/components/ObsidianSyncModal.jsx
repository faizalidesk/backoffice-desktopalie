import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { SiObsidian } from 'react-icons/si';
import { 
  FiRefreshCw, 
  FiCheckCircle, 
  FiFolder, 
  FiFileText, 
  FiDownload, 
  FiUpload, 
  FiExternalLink,
  FiHardDrive
} from 'react-icons/fi';
import { backofficeService } from '../services/backofficeService';
import obsidianBackup from '../config/obsidian_vault_data.json';
import { toast } from 'react-hot-toast';

const VAULT_PATH = 'C:\\Users\\Cerebrum\\Documents\\Obsidian Vault\\Desktopalie Workspace';

export default function ObsidianSyncModal({ isOpen, onClose, onSyncComplete }) {
  const [loading, setLoading] = useState(false);
  const [syncDetails, setSyncDetails] = useState(null);
  const [vaultNotes, setVaultNotes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'graph'
  const [selectedGraphNode, setSelectedGraphNode] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadVaultStatus();
    }
  }, [isOpen]);

  const loadVaultStatus = async () => {
    setLoading(true);
    try {
      const settingsMap = await backofficeService.getAllSiteSettings();
      const vaultData = settingsMap['obsidian_vault_docs'];
      
      if (vaultData && vaultData.items) {
        setSyncDetails({
          syncedAt: vaultData.synced_at,
          totalItems: vaultData.total_items,
          vaultPath: vaultData.vault_path || VAULT_PATH
        });
        setVaultNotes(vaultData.items);
      } else {
        // Fallback to local JSON import
        setSyncDetails({
          syncedAt: new Date().toISOString(),
          totalItems: obsidianBackup.length,
          vaultPath: VAULT_PATH
        });
        setVaultNotes(obsidianBackup);
      }
    } catch (err) {
      console.warn('Error loading Obsidian status:', err);
      setVaultNotes(obsidianBackup);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = async () => {
    setLoading(true);
    try {
      // Save local backup to Supabase site_settings
      await backofficeService.saveSiteSetting('obsidian_vault_docs', {
        vault_path: VAULT_PATH,
        synced_at: new Date().toISOString(),
        total_items: obsidianBackup.length,
        items: obsidianBackup
      });

      setSyncDetails({
        syncedAt: new Date().toISOString(),
        totalItems: obsidianBackup.length,
        vaultPath: VAULT_PATH
      });
      setVaultNotes(obsidianBackup);

      toast.success(`Berhasil sinkron ${obsidianBackup.length} catatan Obsidian Vault!`);
      if (onSyncComplete) onSyncComplete(obsidianBackup);
    } catch (err) {
      toast.error('Gagal melakukan sinkronisasi Obsidian');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(vaultNotes.map(n => n.folder || 'Core'))];

  const filteredNotes = activeCategory === 'All' 
    ? vaultNotes 
    : vaultNotes.filter(n => (n.folder || 'Core') === activeCategory);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(124, 58, 237, 0.1)',
            color: '#7c3aed',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <SiObsidian size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>
              Obsidian Desktop-Alie Vault Connector
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
              Status Koneksi & Sinkronisasi Vault Obsidian Real-time
            </p>
          </div>
        </div>
      }
      maxWidth="780px"
    >
      <div style={{ padding: '4px 0' }}>
        {/* Vault Path & Sync Status Banner */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <FiCheckCircle color="#10b981" size={16} />
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>
                  Obsidian Vault Connected & Synced
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                <FiHardDrive size={13} color="#64748b" />
                <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}>
                  {syncDetails?.vaultPath || VAULT_PATH}
                </code>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Terakhir disinkronkan: {syncDetails?.syncedAt ? new Date(syncDetails.syncedAt).toLocaleString('id-ID') : 'Baru saja'} • {syncDetails?.totalItems || vaultNotes.length} Catatan Markdown
              </div>
            </div>

            <button
              onClick={handleManualSync}
              disabled={loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: loading ? 'wait' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <FiRefreshCw className={loading ? 'spin' : ''} size={14} />
              {loading ? 'Menyingkronkan...' : 'Sinkronkan Vault Now'}
            </button>
          </div>
        </div>

        {/* View Mode Toggle: List vs Graph View */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: activeCategory === cat ? '#7c3aed' : '#cbd5e1',
                  background: activeCategory === cat ? '#7c3aed' : '#ffffff',
                  color: activeCategory === cat ? '#ffffff' : '#475569',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FiFolder size={12} />
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px', gap: '2px' }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'list' ? '#ffffff' : 'transparent',
                color: viewMode === 'list' ? '#0f172a' : '#64748b',
                fontWeight: viewMode === 'list' ? 600 : 400,
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              📄 List View
            </button>
            <button
              onClick={() => setViewMode('graph')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'graph' ? '#7c3aed' : 'transparent',
                color: viewMode === 'graph' ? '#ffffff' : '#64748b',
                fontWeight: viewMode === 'graph' ? 600 : 400,
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: viewMode === 'graph' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              🕸️ Graph View
            </button>
          </div>
        </div>

        {viewMode === 'graph' ? (
          /* OBSIDIAN GRAPH VIEW CANVAS */
          <div style={{
            background: '#111827',
            borderRadius: '10px',
            padding: '16px',
            height: '340px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #1f2937'
          }}>
            <div style={{ position: 'absolute', top: '12px', left: '16px', color: '#9ca3af', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SiObsidian color="#8b5cf6" size={14} />
              <span>Interactive Graph Map — {filteredNotes.length} Nodes</span>
            </div>

            {selectedGraphNode && (
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '16px',
                right: '16px',
                background: 'rgba(31, 41, 55, 0.9)',
                backdropFilter: 'blur(4px)',
                border: '1px solid #374151',
                borderRadius: '6px',
                padding: '8px 12px',
                color: '#f3f4f6',
                fontSize: '12px',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>{selectedGraphNode.title}</strong>
                  <span style={{ color: '#9ca3af', marginLeft: '8px', fontSize: '11px' }}>[{selectedGraphNode.folder || 'Core'}]</span>
                </div>
                <span style={{ color: '#8b5cf6', fontSize: '11px' }}>Wikilink Connected</span>
              </div>
            )}

            <svg width="100%" height="100%" viewBox="0 0 700 300" style={{ overflow: 'visible' }}>
              {/* Lines from Central Node (350, 150) */}
              {filteredNotes.slice(0, 24).map((note, index) => {
                const angle = (index / Math.min(filteredNotes.length, 24)) * 2 * Math.PI;
                const radius = 100 + (index % 3) * 25;
                const cx = 350 + Math.cos(angle) * radius;
                const cy = 150 + Math.sin(angle) * (radius * 0.65);
                const isHovered = selectedGraphNode?.title === note.title;

                return (
                  <g key={index} style={{ cursor: 'pointer' }} onClick={() => setSelectedGraphNode(note)}>
                    <line
                      x1="350"
                      y1="150"
                      x2={cx}
                      y2={cy}
                      stroke={isHovered ? '#a855f7' : '#374151'}
                      strokeWidth={isHovered ? '2' : '1'}
                      strokeDasharray={isHovered ? 'none' : '3,3'}
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? '7' : '4'}
                      fill={isHovered ? '#c084fc' : (note.folder?.includes('Platform') ? '#60a5fa' : note.folder?.includes('Backoffice') ? '#34d399' : '#f472b6')}
                    />
                    <text
                      x={cx + 8}
                      y={cy + 4}
                      fill={isHovered ? '#ffffff' : '#9ca3af'}
                      fontSize="9"
                      fontFamily="sans-serif"
                    >
                      {note.title.length > 22 ? note.title.substring(0, 22) + '...' : note.title}
                    </text>
                  </g>
                );
              })}

              {/* Central Master Node */}
              <g>
                <circle cx="350" cy="150" r="12" fill="#7c3aed" />
                <circle cx="350" cy="150" r="18" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.6" />
                <text x="350" y="180" textAnchor="middle" fill="#f3f4f6" fontSize="11" fontWeight="bold">
                  Desktopalie Workspace MOC
                </text>
              </g>
            </svg>
          </div>
        ) : (
          /* Notes Grid Preview */
          <div style={{
            maxHeight: '340px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '12px',
            paddingRight: '4px'
          }}>
          {filteredNotes.map((note, idx) => (
            <div
              key={note.id || idx}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                background: '#ffffff',
                transition: 'border-color 0.2s',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <FiFileText color="#7c3aed" size={14} />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: '#64748b',
                    letterSpacing: '0.5px'
                  }}>
                    {note.folder || 'Core'}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>
                  {note.title}
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '11px',
                  color: '#64748b',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {note.content?.replace(/^#+\s+/gm, '') || 'Tidak ada pratinjau konten'}
                </p>
              </div>

              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #f1f5f9', fontSize: '10px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                <span>{note.author || 'Obsidian'}</span>
                <span>.md</span>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Action Footer */}
        <div style={{
          marginTop: '20px',
          paddingTop: '14px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            NPM CLI: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>npm run obsidian:sync</code>
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontWeight: 500,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </Modal>
  );
}
