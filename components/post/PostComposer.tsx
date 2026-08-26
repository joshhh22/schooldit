'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Image as ImageIcon,
  BarChart2,
  Link2,
  X,
  Plus,
  Trash2,
  UploadCloud,
  Film,
  Globe,
} from 'lucide-react';
import { PostFlair, PostType, Attachment } from '@/lib/types';
import { useSchooldit } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { CreateSchoolModal } from '@/components/school/CreateSchoolModal';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

const SUGGESTED_FLAIRS: PostFlair[] = [
  'RAMAI',
  'SPILL',
  'NGOBROL',
  'WKWK',
  'CURHAT',
  'INFO',
  'TANYA',
  'EVENT',
];

interface PostComposerProps {
  onSuccess?: () => void;
  defaultSchoolId?: string;
}

export function PostComposer({ onSuccess, defaultSchoolId }: PostComposerProps) {
  const router = useRouter();
  const { schools, session, addPost } = useSchooldit();
  const { showToast } = useToast();

  const [activeType, setActiveType] = useState<PostType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [schoolId, setSchoolId] = useState(defaultSchoolId || 'all');
  const [selectedFlair, setSelectedFlair] = useState<PostFlair>('NGOBROL');
  const [customFlair, setCustomFlair] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isCreateSchoolOpen, setIsCreateSchoolOpen] = useState(false);

  // Drag and drop & Attachments state
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  const handleAddPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handlePollOptionChange = (index: number, val: string) => {
    const updated = [...pollOptions];
    updated[index] = val;
    setPollOptions(updated);
  };

  // Helper to process uploaded file (from file input, OS drag, or clipboard paste)
  const processFile = async (file: File) => {
    if (file.size > 100 * 1024 * 1024) {
      showToast('Ukuran File Terlalu Besar', 'Maksimal ukuran file adalah 100MB.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    const isImg = file.type.startsWith('image/');
    const isVid =
      file.type.startsWith('video/') ||
      file.name.endsWith('.mp4') ||
      file.name.endsWith('.webm') ||
      file.name.endsWith('.mov');

    let finalUrl = '';

    // 1. Try uploading to Supabase Storage Bucket 'media'
    if (isSupabaseConfigured && supabase) {
      try {
        const fileExt = file.name.split('.').pop() || (isVid ? 'mp4' : 'jpg');
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

        setUploadProgress(50);
        const { data, error } = await supabase.storage
          .from('media')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (!error && data) {
          const { data: pubData } = supabase.storage
            .from('media')
            .getPublicUrl(fileName);
          finalUrl = pubData.publicUrl;
        } else {
          console.warn('Storage upload note:', error?.message);
        }
      } catch (err) {
        console.warn('Storage upload exception:', err);
      }
    }

    // 2. Fallback to FileReader if storage not configured
    if (!finalUrl) {
      const reader = new FileReader();
      reader.onload = (event) => {
        finalUrl = event.target?.result as string;
        finishUpload(finalUrl, isVid, isImg, file.name, `${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      };
      reader.onerror = () => {
        setIsUploading(false);
        showToast('Gagal Membaca File', 'Terjadi kesalahan saat memproses media.', 'error');
      };
      reader.readAsDataURL(file);
      return;
    }

    finishUpload(finalUrl, isVid, isImg, file.name, `${(file.size / (1024 * 1024)).toFixed(1)} MB`);
  };

  const finishUpload = (url: string, isVid: boolean, isImg: boolean, name: string, size: string) => {
    setUploadProgress(100);
    setIsUploading(false);

    setAttachments((prev) => [
      ...prev,
      {
        id: `att-${Date.now()}`,
        type: isVid ? 'video' : isImg ? 'image' : 'document',
        url: url,
        name: name,
        size: size,
      },
    ]);
    showToast('Media Ditambahkan', `${name} siap diposting.`, 'success');
  };

  const handleUploadFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFile(files[0]);
  };

  // Drag and Drop Handler (supports local files AND images dragged directly from Google / other tabs)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // Case 1: Local Files dragged from computer explorer
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        await processFile(e.dataTransfer.files[i]);
      }
      return;
    }

    // Case 2: Image dragged directly from Google Images or another website
    const htmlData = e.dataTransfer.getData('text/html');
    const uriList = e.dataTransfer.getData('text/uri-list');
    const plainText = e.dataTransfer.getData('text/plain');

    let extractedUrl = '';

    if (htmlData) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlData, 'text/html');
        const img = doc.querySelector('img');
        if (img && img.src) {
          extractedUrl = img.src;
        }
      } catch {}
    }

    if (!extractedUrl && uriList) {
      const urls = uriList.split('\r\n').filter((u) => u && !u.startsWith('#'));
      if (urls.length > 0) {
        extractedUrl = urls[0];
      }
    }

    if (!extractedUrl && plainText && (plainText.startsWith('http://') || plainText.startsWith('https://') || plainText.startsWith('data:image'))) {
      extractedUrl = plainText.trim();
    }

    if (extractedUrl) {
      const isVid = extractedUrl.includes('.mp4') || extractedUrl.includes('.webm');
      finishUpload(extractedUrl, isVid, !isVid, 'Web Image', 'Direct Web URL');
      return;
    }

    showToast('Format Tidak Dikenal', 'Tarik file gambar/video atau copy-paste langsung.', 'info');
  };

  // Paste handler (supports screenshot paste Ctrl+V)
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1 || items[i].type.indexOf('video') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processFile(file);
          break;
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Judul Wajib Diisi', 'Berikan judul untuk postinganmu.', 'error');
      return;
    }

    if (!content.trim() && attachments.length === 0 && activeType !== 'poll') {
      showToast('Isi Postingan Wajib Diisi', 'Tuliskan deskripsi atau unggah media.', 'error');
      return;
    }

    let pollData = undefined;
    if (activeType === 'poll') {
      const validOptions = pollOptions.filter((opt) => opt.trim().length > 0);
      if (validOptions.length < 2) {
        showToast('Polling Tidak Valid', 'Sediakan minimal 2 pilihan opsi.', 'error');
        return;
      }
      pollData = {
        question: pollQuestion.trim() || title.trim(),
        options: validOptions,
      };
    }

    const finalFlair = (customFlair.trim().toUpperCase() || selectedFlair) as PostFlair;

    const created = addPost({
      schoolId,
      title: title.trim(),
      content: content.trim(),
      flair: finalFlair,
      type: attachments.some((a) => a.type === 'video') ? 'video' : activeType,
      attachments: attachments.length > 0 ? attachments : undefined,
      poll: pollData,
      linkUrl: linkUrl.trim() || undefined,
    });

    showToast('Postingan Diterbitkan!', `Diposting sebagai ${session.pseudonym}`, 'success');

    if (onSuccess) {
      onSuccess();
    } else {
      router.push(`/thread/${created.id}`);
    }
  };

  return (
    <>
      <div
        onPaste={handlePaste}
        className="reddit-card p-4 sm:p-6 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b] space-y-4 font-sans max-w-full"
      >
        {/* Header Title */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1e293b]">
          <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
            Create a post
          </h2>
          <div className="text-xs text-slate-400">
            Posting as <span className="font-semibold text-slate-200">{session.avatar} {session.pseudonym}</span>
          </div>
        </div>

        {/* Community Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-64">
            <select
              value={schoolId}
              onChange={(e) => {
                if (e.target.value === '__new__') {
                  setIsCreateSchoolOpen(true);
                } else {
                  setSchoolId(e.target.value);
                }
              }}
              className="w-full text-xs font-semibold py-2 px-3 bg-slate-100 dark:bg-[#162035] border border-slate-200 dark:border-[#1e293b] rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-sky-500"
            >
              <option value="all">🌐 s/semua (Feed Utama Publik)</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  👥 s/{s.slug} ({s.name})
                </option>
              ))}
              <option value="__new__">+ Buat Komunitas Baru...</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateSchoolOpen(true)}
            className="text-xs font-semibold text-sky-400 hover:underline px-2 py-1"
          >
            + Buat Komunitas Baru
          </button>
        </div>

        {/* Tabs (Post, Image & Video, Poll, Link) */}
        <div className="flex items-center border-b border-slate-200 dark:border-[#1e293b] text-xs font-bold">
          {[
            { type: 'text' as PostType, label: 'Post', icon: FileText },
            { type: 'image' as PostType, label: 'Images & Video', icon: ImageIcon },
            { type: 'poll' as PostType, label: 'Poll', icon: BarChart2 },
            { type: 'link' as PostType, label: 'Link', icon: Link2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeType === tab.type;
            return (
              <button
                key={tab.type}
                type="button"
                onClick={() => setActiveType(tab.type)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                  isActive
                    ? 'border-sky-400 text-sky-400 font-bold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title *"
              className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#162035] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-500"
              maxLength={250}
            />
          </div>

          {/* Link URL Input */}
          {activeType === 'link' && (
            <div>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Url (https://...)"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#162035] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-500"
              />
            </div>
          )}

          {/* Media Upload Area (Supports File Picker, Local Drag-and-Drop, Web/Google Image Drag, Paste Ctrl+V) */}
          {activeType === 'image' && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`space-y-3 p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all text-center ${
                isDragging
                  ? 'border-sky-500 bg-sky-500/10 scale-[1.01]'
                  : 'border-slate-300 dark:border-[#334155] bg-slate-50 dark:bg-[#162035]'
              }`}
            >
              <UploadCloud className={`w-10 h-10 mx-auto transition-transform ${isDragging ? 'text-sky-400 scale-125' : 'text-sky-500'}`} />
              
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Tarik gambar langsung dari Google / Komputer ke sini
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Mendukung Drag & Drop dari web/Google, Upload File (Foto/Video MP4), atau Paste (Ctrl+V)
                </p>
              </div>

              <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-full cursor-pointer transition-all shadow-xs active:scale-95">
                <span>Pilih File Dari Komputer/HP</span>
                <input
                  type="file"
                  accept="image/*,video/*,.mp4,.mov,.webm,.mkv,.pdf"
                  onChange={handleUploadFileInput}
                  className="hidden"
                />
              </label>

              {isUploading && (
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-sky-400 h-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              {attachments.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-[#1e293b] h-28 bg-black flex items-center justify-center group"
                    >
                      {att.type === 'image' ? (
                        <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                      ) : att.type === 'video' ? (
                        <div className="w-full h-full relative flex items-center justify-center bg-slate-900">
                          <video src={att.url} className="w-full h-full object-cover" muted />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                            <Film className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      ) : (
                        <span className="text-white text-xs p-2 text-center truncate">{att.name}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setAttachments(attachments.filter((a) => a.id !== att.id))}
                        className="absolute top-1.5 right-1.5 p-1 bg-black/80 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Poll Builder Area */}
          {activeType === 'poll' && (
            <div className="space-y-3 p-4 bg-slate-50 dark:bg-[#162035] rounded-xl border border-slate-200 dark:border-[#1e293b]">
              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Poll question (optional if same as title)..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f1626] focus:outline-hidden focus:border-sky-500"
              />

              <div className="space-y-2">
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 w-4">{idx + 1}.</span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}...`}
                      className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-white dark:bg-[#0f1626] focus:outline-hidden focus:border-sky-500"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePollOption(idx)}
                        className="p-2 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                {pollOptions.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="flex items-center gap-1.5 text-xs text-sky-400 font-bold hover:underline pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add option</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Text Area */}
          <div>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Text (optional for media, or share your story/spill)..."
              className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#162035] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          {/* Flair Picker */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Topic / Flair Tag:
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {SUGGESTED_FLAIRS.map((flair) => (
                <button
                  key={flair}
                  type="button"
                  onClick={() => {
                    setSelectedFlair(flair);
                    setCustomFlair('');
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                    selectedFlair === flair && !customFlair
                      ? 'bg-sky-500 text-white border-sky-500 font-bold'
                      : 'bg-slate-100 dark:bg-[#162035] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#1e293b]'
                  }`}
                >
                  #{flair}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={customFlair}
              onChange={(e) => setCustomFlair(e.target.value)}
              placeholder="Atau ketik topik kustom sendiri (contoh: BASKET, MLBB, CURHAT, GOSIP)..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#162035] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#1e293b]">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#162035] rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 font-bold text-white bg-sky-500 hover:bg-sky-600 active:scale-95 rounded-full transition-all shadow-xs"
            >
              Post
            </button>
          </div>
        </form>
      </div>

      <CreateSchoolModal
        isOpen={isCreateSchoolOpen}
        onClose={() => setIsCreateSchoolOpen(false)}
      />
    </>
  );
}
