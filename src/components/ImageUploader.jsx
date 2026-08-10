import { useState } from 'react';
import { FiUploadCloud, FiX, FiImage, FiCheckCircle } from 'react-icons/fi';
import { backofficeService } from '../services/backofficeService';
import { toast } from 'react-hot-toast';

export default function ImageUploader({ value, onChange, folder = 'general', label = 'Upload Gambar / Cover' }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar (JPG, PNG, WebP, GIF)');
      return;
    }

    setUploading(true);
    try {
      const url = await backofficeService.uploadMedia(file, folder);
      if (url) {
        onChange(url);
        toast.success('Gambar berhasil di-upload!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal meng-upload gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      
      {value ? (
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          maxHeight: '180px',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src={value} 
            alt="Preview" 
            style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
          />
          <button
            type="button"
            className="btn btn-danger btn-sm btn-icon"
            onClick={() => onChange('')}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              borderRadius: '50%',
              boxShadow: 'var(--shadow-md)'
            }}
            title="Hapus Gambar"
          >
            <FiX />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '1.5rem',
            textAlign: 'center',
            backgroundColor: dragOver ? 'var(--primary-light)' : '#F8FAFC',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <input
            type="file"
            accept="image/*"
            id={`file-input-${folder}`}
            style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
          />
          <label htmlFor={`file-input-${folder}`} style={{ cursor: 'pointer', display: 'block' }}>
            <FiUploadCloud style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)' }}>
              {uploading ? 'Meng-upload Gambar...' : 'Tarik & lepas gambar di sini, atau klik untuk memilih'}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Format: PNG, JPG, WebP, SVG (Maks. 5MB)
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
