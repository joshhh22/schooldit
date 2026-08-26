'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Lock,
  KeyRound,
  LogOut,
  RotateCcw,
  X,
} from 'lucide-react';
import { useSchooldit } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';

export default function AdminPage() {
  const {
    reports,
    handleReportAction,
    resetAllData,
    isAdmin,
    loginAdmin,
    logoutAdmin,
  } = useSchooldit();
  const { showToast } = useToast();

  const [passcode, setPasscode] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('pending');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passcode);
    if (success) {
      showToast('Admin Mode Aktif', 'Selamat datang, Moderator Utama Schooldit.', 'success');
      setPasscode('');
    } else {
      showToast('Passcode Salah', 'Kunci akses admin tidak valid.', 'error');
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const handleAction = (reportId: string, action: 'dismiss' | 'delete') => {
    handleReportAction(reportId, action);
    if (action === 'delete') {
      showToast('Konten Dihapus', 'Konten telah dihapus dari Schooldit oleh Admin.', 'error');
    } else {
      showToast('Laporan Diabaikan', 'Laporan ditandai sebagai dismissed.', 'info');
    }
  };

  const handleClearEverything = () => {
    if (confirm('Yakin ingin mereset seluruh database lokal menjadi kosong bersih?')) {
      resetAllData();
      showToast('Database Bersih!', 'Semua data telah dikosongkan.', 'success');
    }
  };

  // If NOT logged in as Admin, display PIN Passcode Login Guard
  if (!isAdmin) {
    return (
      <div className="reddit-card p-6 sm:p-8 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b] max-w-md mx-auto text-center space-y-4 font-sans">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
            Admin Access Verification
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Halaman ini khusus untuk pembuat & moderator platform Schooldit. Pengguna biasa tidak memiliki hak menghapus konten.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3 pt-2">
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Masukkan PIN / Passcode Admin..."
              className="w-full text-xs py-2.5 pl-10 pr-4 bg-slate-50 dark:bg-[#162035] border border-slate-200 dark:border-[#1e293b] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
          >
            Masuk sebagai Admin
          </button>
        </form>

        <p className="text-[11px] text-slate-400 pt-1">
          💡 Default passcode: <code className="bg-slate-100 dark:bg-[#162035] px-1.5 py-0.5 rounded text-sky-400 font-mono">admin123</code> atau <code className="bg-slate-100 dark:bg-[#162035] px-1.5 py-0.5 rounded text-sky-400 font-mono">schooldit</code>
        </p>
      </div>
    );
  }

  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  return (
    <div className="space-y-4 font-sans">
      {/* Admin Logged-In Header */}
      <div className="reddit-card p-4 sm:p-5 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Admin Moderation Dashboard</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AUTHENTICATED
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Hak penuh untuk mengawasi forum, meninjau laporan, dan menghapus konten melanggar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearEverything}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-[#162035] hover:bg-rose-500 hover:text-white text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-full border border-slate-200 dark:border-[#1e293b] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Flush Database</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-[#162035] hover:bg-slate-200 dark:hover:bg-[#1e293b] text-slate-700 dark:text-slate-300 text-xs font-bold rounded-full border border-slate-200 dark:border-[#1e293b] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Admin</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-slate-100 dark:border-[#1e293b] text-xs">
          <div className="bg-slate-50 dark:bg-[#162035] p-3 rounded-xl border border-slate-200 dark:border-[#1e293b]">
            <p className="text-slate-400 text-[11px]">Menunggu Tinjauan</p>
            <p className="text-lg font-bold text-amber-400 font-mono mt-0.5">{pendingCount}</p>
          </div>
          <div className="bg-slate-50 dark:bg-[#162035] p-3 rounded-xl border border-slate-200 dark:border-[#1e293b]">
            <p className="text-slate-400 text-[11px]">Konten Dihapus</p>
            <p className="text-lg font-bold text-rose-400 font-mono mt-0.5">{resolvedCount}</p>
          </div>
          <div className="bg-slate-50 dark:bg-[#162035] p-3 rounded-xl border border-slate-200 dark:border-[#1e293b]">
            <p className="text-slate-400 text-[11px]">Total Laporan</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">{reports.length}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'pending', label: `Perlu Ditinjau (${pendingCount})` },
          { id: 'resolved', label: 'Tindakan Selesai' },
          { id: 'dismissed', label: 'Diabaikan' },
          { id: 'all', label: 'Semua Laporan' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id as typeof filterStatus)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterStatus === tab.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-[#1e293b] text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div key={report.id} className="reddit-card p-4 space-y-3 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Alasan: {report.reason}
                  </span>
                  <span className="text-xs text-slate-400">
                    Target: {report.targetType === 'post' ? 'Postingan' : 'Komentar'}
                  </span>
                </div>

                <span className="text-[10px] font-bold text-slate-400">
                  Status: {report.status.toUpperCase()}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#162035] rounded-xl border border-slate-200 dark:border-[#1e293b] text-xs">
                {report.postTitle && (
                  <p className="font-bold text-slate-900 dark:text-white mb-1">
                    "{report.postTitle}"
                  </p>
                )}
                <p className="text-slate-700 dark:text-slate-300 italic">
                  "{report.targetContent}"
                </p>
              </div>

              {report.status === 'pending' && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#1e293b]">
                  <button
                    onClick={() => handleAction(report.id, 'dismiss')}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-200 dark:border-[#1e293b] hover:bg-slate-100 dark:hover:bg-[#162035] text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Abaikan</span>
                  </button>

                  <button
                    onClick={() => handleAction(report.id, 'delete')}
                    className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Konten</span>
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="reddit-card p-10 text-center space-y-3 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b]">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Tidak Ada Laporan Pelanggaran
            </h3>
            <p className="text-xs text-slate-400">
              Belum ada laporan konten dari siswa. Komunitas dalam keadaan aman dan bersih.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
