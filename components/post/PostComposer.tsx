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
  Hash,
} from 'lucide-react';
import { PostFlair, PostType, Attachment } from '@/lib/types';
import { useSchooldit } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { CreateSchoolModal } from '@/components/school/CreateSchoolModal';

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

  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Poll
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

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 15 * 1024 * 1024) {
      showToast('Ukuran File Terlalu Besar', 'Maksimal ukuran file adalah 15MB.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(30);

    setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);

      const isImg = file.type.startsWith('image/');
      const objectUrl = URL.createObjectURL(file);

      setAttachments((prev) => [
        ...prev,
        {
          id: `att-${Date.now()}`,
          type: isImg ? 'image' : 'document',
          url: objectUrl,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        },
      ]);
      showToast('File Terunggah', file.name, 'success');
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Judul Wajib Diisi', 'Berikan judul untuk postinganmu.', 'error');
      return;
    }

    if (!content.trim()) {
      showToast('Isi Postingan Wajib Diisi', 'Tuliskan deskripsi atau isi cerita.', 'error');
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
      type: activeType,
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
      <div className="reddit-card p-4 sm:p-6 bg-white dark:bg-[#0f1626] border-slate-200 dark:border-[#1e293b] space-y-4 font-sans">
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
              <option value="all">🌐 s/semua (Publik Lintas Sekolah)</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  🏫 s/{s.slug} ({s.shortName})
                </option>
              ))}
              <option value="__new__">+ Buat Komunitas Sekolah Baru...</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateSchoolOpen(true)}
            className="text-xs font-semibold text-sky-400 hover:underline px-2 py-1"
          >
            + Daftarkan Sekolah Lain
          </button>
        </div>

        {/* Tabs (Post, Image, Poll, Link) */}
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

          {/* Media Upload Area */}
          {activeType === 'image' && (
            <div className="space-y-3 p-6 bg-slate-50 dark:bg-[#162035] rounded-xl border border-dashed border-slate-300 dark:border-[#334155] text-center">
              <UploadCloud className="w-8 h-8 text-sky-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Drag and drop images or upload
              </p>
              <label className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-full cursor-pointer transition-all">
                <span>Upload Media</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleUploadFile}
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-[#1e293b] h-24 bg-black flex items-center justify-center group"
                    >
                      {att.type === 'image' ? (
                        <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-xs">{att.name}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setAttachments(attachments.filter((a) => a.id !== att.id))}
                        className="absolute top-1 right-1 p-1 bg-black/80 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
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
              placeholder="Atau ketik topik kustom sendiri (contoh: CURHATAN, GOSIP, PR)..."
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
