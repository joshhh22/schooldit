'use client';

import React, { useState } from 'react';
import { School as SchoolIcon, X, Plus, Sparkles, Check } from 'lucide-react';
import { useSchooldit } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';

interface CreateSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BADGE_COLORS = [
  '#0284c7', // Sky
  '#2563eb', // Blue
  '#16a34a', // Green
  '#0d9488', // Teal
  '#d97706', // Amber
  '#475569', // Slate
  '#dc2626', // Red
  '#0891b2', // Cyan
];

export function CreateSchoolModal({ isOpen, onClose }: CreateSchoolModalProps) {
  const { addSchool } = useSchooldit();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState<'SMA' | 'SMK' | 'MA' | 'SMP' | 'Lainnya'>('SMA');
  const [description, setDescription] = useState('');
  const [badgeColor, setBadgeColor] = useState(BADGE_COLORS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Nama Sekolah Wajib Diisi', 'Masukkan nama lengkap sekolah.', 'error');
      return;
    }

    const calculatedShortName = shortName.trim() || name.trim();
    const slug = calculatedShortName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newSchool = addSchool({
      name: name.trim(),
      shortName: calculatedShortName,
      slug: slug || `sekolah-${Date.now()}`,
      city: city.trim() || 'Indonesia',
      type,
      badgeColor,
      description: description.trim() || `Komunitas resmi siswa ${calculatedShortName}.`,
    });

    showToast('Komunitas Sekolah Dibuat!', `s/${newSchool.slug} berhasil ditambahkan.`, 'success');
    setName('');
    setShortName('');
    setCity('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div className="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-[#1e293b] rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 relative text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-[#1e293b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <SchoolIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold">Buat Komunitas Sekolah (s/...)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daftarkan sekolahmu agar siswa lain bisa bergabung dan ngobrol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Nama Lengkap Sekolah:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: SMA Negeri 1 Jakarta"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#162035] focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Nama Singkat / Alias:</label>
              <input
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="Contoh: SMAN 1 JKT (Boedoet)"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#162035] focus:outline-hidden focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Jenjang / Tipe:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#162035] focus:outline-hidden focus:border-sky-500"
              >
                <option value="SMA">SMA</option>
                <option value="SMK">SMK</option>
                <option value="MA">MA</option>
                <option value="SMP">SMP</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Kota / Wilayah:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Contoh: Jakarta Pusat, Surabaya, dll"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#162035] focus:outline-hidden focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Warna Badge:</label>
              <div className="flex items-center gap-1.5 pt-1">
                {BADGE_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBadgeColor(c)}
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: c }}
                  >
                    {badgeColor === c && <Check className="w-3.5 h-3.5 text-white stroke-3" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Deskripsi Singkat Komunitas:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan tentang sekolah ini atau topik obrolan..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#162035] focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1e293b]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-sky-500 hover:bg-sky-600 active:scale-95 rounded-xl transition-all shadow-md"
            >
              Buat Komunitas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
