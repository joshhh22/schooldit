'use client';

import React, { useState } from 'react';
import { ShieldAlert, X, Check } from 'lucide-react';
import { useSchooldit } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'post' | 'comment';
  targetTitle?: string;
  targetContent: string;
}

const REPORT_REASONS = [
  { label: 'Spam atau Iklan Promosi', value: 'Spam', desc: 'Promosi joki tugas, bot, tautan berbahaya' },
  { label: 'Pelecehan / Cyberbullying', value: 'Pelecehan', desc: 'Ujaran kebencian, hinaan, merendahkan siswa/guru' },
  { label: 'Penyebaran Data Pribadi (Doxxing)', value: 'Data pribadi', desc: 'Menyebarkan nama asli, foto privasi, nomor WA, alamat' },
  { label: 'Penyamaran Identitas', value: 'Penyamaran', desc: 'Mengaku sebagai pihak sekolah resmi atau individu lain' },
  { label: 'Konten Ilegal / Berbahaya', value: 'Konten ilegal', desc: 'Kekerasan, tawuran, senjata, pornografi' },
  { label: 'Pelanggaran Lainnya', value: 'Lainnya', desc: 'Ketidaksesuaian aturan forum komunitas sekolah' },
] as const;

export function ReportModal({
  isOpen,
  onClose,
  targetId,
  targetType,
  targetTitle,
  targetContent,
}: ReportModalProps) {
  const { addReport } = useSchooldit();
  const { showToast } = useToast();

  const [selectedReason, setSelectedReason] = useState<typeof REPORT_REASONS[number]['value']>('Spam');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      addReport({
        targetId,
        targetType,
        postTitle: targetTitle,
        targetContent: targetContent.slice(0, 140),
        reason: selectedReason,
        details: details.trim() || undefined,
      });

      setIsSubmitting(false);
      showToast('Laporan Terkirim', 'Moderator akan meninjau laporan ini segera.', 'info');
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#14181d] border border-slate-200 dark:border-[#252c36] rounded-2xl max-w-md w-full p-5 shadow-2xl animate-in zoom-in-95 duration-150 relative text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#252c36]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Laporkan Konten</h3>
              <p className="text-[11px] text-slate-400">Jaga keamanan dan etika komunitas Schooldit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Snippet */}
        <div className="my-3 p-2.5 bg-slate-50 dark:bg-[#1a1f26] rounded-xl text-xs border border-slate-100 dark:border-[#252c36]">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Konten dilaporkan: </span>
          <p className="line-clamp-2 mt-0.5 italic text-slate-400">
            "{targetTitle ? `${targetTitle} — ` : ''}{targetContent}"
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1.5">
              Pilih Alasan Pelaporan:
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {REPORT_REASONS.map((r) => {
                const isSelected = selectedReason === r.value;
                return (
                  <label
                    key={r.value}
                    onClick={() => setSelectedReason(r.value)}
                    className={`flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500'
                        : 'border-slate-200 dark:border-[#252c36] hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-rose-500 bg-rose-500 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-3" />}
                    </div>
                    <div>
                      <p className="font-semibold">{r.label}</p>
                      <p className="text-[10px] text-slate-400">{r.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Keterangan Tambahan:
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Berikan konteks tambahan..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#252c36] bg-slate-50 dark:bg-[#1a1f26] focus:outline-hidden focus:border-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#252c36]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-1.5 font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-full transition-all shadow-sm"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
