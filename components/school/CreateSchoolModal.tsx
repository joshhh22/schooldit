'use client';

import React, { useState } from 'react';
import { Users, X, Plus, Sparkles, Check, Hash } from 'lucide-react';
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
  '#7c3aed', // Purple
  '#dc2626', // Red
  '#0891b2', // Cyan
];

const COMMUNITY_CATEGORIES = [
  'Hobi',
  'Olahraga',
  'Gaming',
  'Musik',
  'Akademik',
  'Sekolah',
  'Curhat',
  'Lainnya',
] as const;

export function CreateSchoolModal({ isOpen, onClose }: CreateSchoolModalProps) {
  const { addSchool } = useSchooldit();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [slugInput, setSlugInput] = useState('');
  const [category, setCategory] = useState<typeof COMMUNITY_CATEGORIES[number]>('Hobi');
  const [description, setDescription] = useState('');
  const [badgeColor, setBadgeColor] = useState(BADGE_COLORS[0]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugInput || slugInput === generateSlug(name)) {
      setSlugInput(generateSlug(val));
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Nama Komunitas Wajib Diisi', 'Masukkan nama komunitas yang ingin dibuat.', 'error');
      return;
    }

    const calculatedSlug = generateSlug(slugInput.trim() || name.trim()) || `komunitas-${Date.now()}`;

    const newCommunity = addSchool({
      name: name.trim(),
      shortName: name.trim(),
      slug: calculatedSlug,
      city: category,
      category,
      badgeColor,
      description: description.trim() || `Wadah diskusi dan ngobrol seputar ${name.trim()}.`,
    });

    showToast('Komunitas Berhasil Dibuat!', `s/${newCommunity.slug} siap digunakan.`, 'success');
    setName('');
    setSlugInput('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div className="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-[#1e293b] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-150 relative text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-[#1e293b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold">Buat Komunitas Baru</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Wadah obrolan untuk olahraga, game, musik, hobi, atau topik favoritmu
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
            <label className="block font-semibold mb-1">
              Nama Komunitas: <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contoh: Komunitas Basket, Gamer Mobile Legends, Musik Indie..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#162035] focus:outline-hidden focus:border-sky-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">
                Alamat URL Komunitas:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-mono">s/</span>
                <input
                  type="text"
                  value={slugInput}
                  onChange={(e) => setSlugInput(e.target.value)}
                  placeholder="basket, mlbb, musik..."
                  className="w-full py-2.5 pl-8 pr-3 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#162035] focus:outline-hidden focus:border-sky-500 font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Kategori / Topik:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#162035] focus:outline-hidden focus:border-sky-500 text-slate-900 dark:text-white"
              >
                {COMMUNITY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Warna Badge / Tema:</label>
            <div className="flex items-center gap-2 pt-1">
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

          <div>
            <label className="block font-semibold mb-1">Deskripsi Singkat Komunitas:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan tentang komunitas ini dan topik obrolan di dalamnya..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#162035] focus:outline-hidden focus:border-sky-500 text-slate-900 dark:text-white"
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
              className="px-5 py-2 font-bold text-white bg-sky-500 hover:bg-sky-600 active:scale-95 rounded-xl transition-all shadow-xs"
            >
              Buat Komunitas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
