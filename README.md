# ðŸŽ“ Schooldit

> **tempat anak sekolah ngomong tanpa nama.**

**Schooldit** adalah platform komunitas anonim untuk lingkungan sekolah di Indonesia.

Terinspirasi dari konsep forum seperti Reddit, Schooldit dibuat dalam skala yang lebih kecil dan lebih dekat dengan kehidupan siswa: tempat untuk berbagi cerita, berdiskusi, bertanya, curhat, spill, shitpost, berbagi informasi, atau sekadar melihat apa yang sedang ramai dibicarakan di sekolah.

**Tanpa akun. Tanpa profil publik. Tanpa harus menunjukkan siapa kamu.**

---

## ðŸ§  Tentang Schooldit

Setiap sekolah punya tempat di mana semua orang tahu sesuatu.

Kadang di kantin.

Kadang di belakang kelas.

Kadang di grup chat.

Kadang cuma lewat bisik-bisik.

Schooldit membawa budaya tersebut ke ruang digital.

Pengguna dapat membuat posting dan ikut berdiskusi secara anonim, sementara sistem tetap memiliki mekanisme teknis untuk menjaga platform dari spam dan penyalahgunaan.

> **Kamu boleh nggak kasih tahu siapa kamu.  
> Tapi kamu tetap bisa ikut ngobrol.**

---

# âœ¨ Design Philosophy

Schooldit menggunakan pendekatan visual yang menggabungkan:

### ðŸŒ± Soft UI Evolution

Bukan neumorphism klasik yang penuh shadow.

Schooldit menggunakan **Soft UI Evolution** dengan:

- soft elevation
- rounded cards
- subtle shadows
- thin borders
- layered surfaces
- smooth transitions
- comfortable spacing
- playful visual details

Tujuannya adalah membuat interface terasa **lembut, modern, tactile, dan menyenangkan digunakan.**

---

### âœ¨ Micro-interactions

Interaksi kecil menjadi bagian penting dari pengalaman Schooldit.

Contoh:

```text
Hover posting
      â†“
kartu sedikit terangkat

Klik vote
      â†“
icon memberikan feedback

Komentar baru
      â†“
muncul dengan animasi halus

Buka thread
      â†“
content transition

Upload file
      â†“
progress animation

Berhasil posting
      â†“
success feedback
```

Animasi digunakan secara fungsional, bukan sekadar dekorasi.

---

# ðŸŒ— Light & Dark Mode

Schooldit mendukung tiga pilihan tampilan:

```text
â˜€ï¸ Terang
ðŸŒ™ Gelap
ðŸ’» Ikuti Sistem
```

### â˜€ï¸ Mode Terang

Menggunakan background yang lembut, surface bertingkat, shadow ringan, dan kontras yang nyaman.

### ðŸŒ™ Mode Gelap

Menggunakan dark surfaces dengan elevation yang tetap terlihat tanpa membuat layar terlalu menyilaukan.

### ðŸ’» Ikuti Sistem

Schooldit dapat mengikuti preferensi tema perangkat pengguna.

Preferensi tema disimpan secara lokal sehingga pilihan pengguna tetap digunakan saat kembali membuka website.

---

# ðŸ« School Community

Schooldit tidak menggunakan pembagian berdasarkan jurusan.

Struktur komunitas dibuat berdasarkan **sekolah**.

Contoh:

```text
Schooldit

â”œâ”€â”€ ðŸ« SMK Negeri 1 Jakarta
â”œâ”€â”€ ðŸ« SMK Negeri 2 Jakarta
â”œâ”€â”€ ðŸ« SMA Negeri 1 Jakarta
â””â”€â”€ ðŸ« SMA Negeri 5 Jakarta
```

Setiap sekolah memiliki community feed sendiri.

---

# ðŸ·ï¸ Post Flair

Daripada membagi komunitas menjadi banyak kategori, posting dapat menggunakan flair.

Contoh:

```text
ðŸ”¥ RAMAI
ðŸ‘€ SPILL
ðŸ’¬ NGOBROL
ðŸ˜‚ WKWK
ðŸ˜­ CURHAT
ðŸ“¢ INFO
â“ TANYA
ðŸŽ‰ EVENT
```

Flair dapat digunakan untuk filtering dan pencarian.

---

# ðŸ“ Anonymous Posting

Pengguna dapat membuat posting tanpa melakukan login atau membuat akun.

Jenis posting:

- ðŸ“ teks
- ðŸ“¸ gambar
- ðŸŽ¥ video
- ðŸ“„ dokumen
- ðŸ”— link
- ðŸ—³ï¸ polling

Contoh:

```text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ ðŸ‘¤ Anonymous Kucing ðŸˆ              â”‚
â”‚                                     â”‚
â”‚ ðŸ‘€ SPILL                            â”‚
â”‚                                     â”‚
â”‚ "ada yang tahu kenapa hari ini..." â”‚
â”‚                                     â”‚
â”‚ â–² 128     ðŸ’¬ 42                     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

# ðŸ‘¤ Anonymous Identity

Schooldit tidak menggunakan username publik sebagai identitas utama.

Setiap anonymous session dapat memperoleh nama sementara seperti:

```text
Anonymous Kucing ðŸˆ
Anonymous Monyet ðŸ’
Anonymous Bebek ðŸ¦†
Anonymous Hiu ðŸ¦ˆ
Anonymous Kucing Oren ðŸˆ
```

Identitas ini hanya berfungsi sebagai **pseudonym sementara** dalam interaksi.

Tidak menampilkan:

- nama asli
- email
- foto profil pribadi
- nomor telepon
- follower
- following

---

# ðŸ’¬ Thread & Comments

Setiap posting memiliki thread diskusinya sendiri.

Fitur:

- komentar
- reply
- nested comments
- vote
- realtime updates
- anonymous identity

Contoh:

```text
ðŸ‘¤ Anonymous Bebek ðŸ¦†

"menurut gue acara kemarin lumayan"

    â–² 34  â–¼

    â””â”€â”€ ðŸ‘¤ Anonymous Hiu ðŸ¦ˆ
        "lumayan dari mana ðŸ˜­"

        â–² 19  â–¼
```

---

# ðŸ”¥ Trending

Schooldit memiliki halaman **Ramai** untuk menampilkan posting yang sedang mendapatkan banyak interaksi.

```text
ðŸ”¥ LAGI RAMAI

01  #ujian
02  #pensi
03  #kantin
04  #osis
05  #study-tour
```

Ranking dapat mempertimbangkan:

- jumlah vote
- jumlah komentar
- umur posting
- pertumbuhan interaksi
- engagement

---

# â¬†ï¸ Voting

Pengguna dapat memberikan vote pada posting dan komentar.

```text
        â–²
       128
        â–¼
```

Voting digunakan untuk membantu komunitas menentukan konten yang dianggap menarik atau relevan.

---

# ðŸ—³ï¸ Polling

Pengguna dapat membuat polling di dalam posting.

Contoh:

> **Besok enaknya pulang jam berapa?**

```text
12:00  â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ  52%
13:00  â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ       31%
14:00  â–ˆâ–ˆâ–ˆâ–ˆ          17%
```

Hasil polling dapat diperbarui secara realtime.

---

# ðŸ“¸ Media & File Upload

Schooldit mendukung upload file menggunakan **Supabase Storage**.

Contoh media:

```text
ðŸ“· JPG
ðŸ“· PNG
ðŸ“· WEBP
ðŸŽžï¸ GIF
ðŸŽ¥ MP4
ðŸŽ¥ WEBM
ðŸ“„ PDF
```

Sistem upload memiliki:

- file size limit
- MIME type validation
- upload progress
- preview
- storage management

File tidak dibiarkan menjadi public dump tanpa kontrol.

---

# âš¡ Realtime

Schooldit menggunakan **Supabase Realtime** untuk membuat interaksi terasa langsung.

Contoh:

```text
47 komentar
     â†“
orang lain mengirim komentar
     â†“
48 komentar
```

Tanpa harus melakukan refresh halaman.

Realtime dapat digunakan untuk:

- komentar
- voting
- polling
- thread activity
- live interaction count

---

# ðŸ”Ž Search

Pengguna dapat mencari konten berdasarkan:

- kata kunci
- judul
- isi posting
- komentar
- flair

Contoh:

```text
ðŸ” "pensi"
```

Kemudian Schooldit menampilkan posting yang relevan.

---

# ðŸš© Reporting

Schooldit mempertahankan konsep anonim, tetapi tetap memiliki sistem pelaporan.

Pengguna dapat melaporkan konten seperti:

```text
ðŸš© Laporkan

â—‹ Spam
â—‹ Pelecehan
â—‹ Data pribadi
â—‹ Penyamaran
â—‹ Konten ilegal
â—‹ Lainnya
```

Sistem ini diperlukan agar platform tetap dapat digunakan sebagai komunitas tanpa berubah menjadi tempat penyalahgunaan.

---

# ðŸ›¡ï¸ Anti-Spam

Meskipun pengguna tidak perlu login, backend tetap menggunakan anonymous session.

Arsitektur:

```text
Browser
   â”‚
   â–¼
Anonymous Session
   â”‚
   â–¼
Next.js
   â”‚
   â”œâ”€â”€ Validation
   â”œâ”€â”€ Rate Limiting
   â””â”€â”€ Permission Check
   â”‚
   â–¼
Supabase
```

Dengan demikian:

> **Tidak perlu login â‰  tidak ada sistem keamanan.**

Anonymous session digunakan untuk membantu:

- rate limiting
- spam prevention
- abuse prevention
- anonymous voting
- session-based interaction

---

# ðŸ§± Tech Stack

## Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**

## UI

- **shadcn/ui**
- **Lucide**
- CSS animations
- Micro-interactions
- Responsive design

## Backend

- **Next.js Server Actions**
- **Next.js Route Handlers**

## Database

- **Supabase PostgreSQL**

## Realtime

- **Supabase Realtime**

## Storage

- **Supabase Storage**

## Deployment

- **Vercel**

---

# ðŸ—„ï¸ Database Architecture

Gambaran sederhana:

```text
schools
   â”‚
   â””â”€â”€ communities
          â”‚
          â””â”€â”€ posts
                â”‚
                â”œâ”€â”€ comments
                â”‚
                â”œâ”€â”€ votes
                â”‚
                â”œâ”€â”€ attachments
                â”‚
                â””â”€â”€ polls
                       â”‚
                       â””â”€â”€ poll_options
```

Tabel utama:

```text
schools
communities
posts
comments
votes
attachments
polls
poll_options
poll_votes
anonymous_sessions
reports
```

---

# ðŸ“ Project Structure

```text
schooldit/
â”‚
â”œâ”€â”€ app/
â”‚   â”‚
â”‚   â”œâ”€â”€ (main)/
â”‚   â”‚   â”œâ”€â”€ home/
â”‚   â”‚   â”œâ”€â”€ sekolah/
â”‚   â”‚   â”œâ”€â”€ posting/
â”‚   â”‚   â””â”€â”€ thread/
â”‚   â”‚
â”‚   â”œâ”€â”€ admin/
â”‚   â”‚
â”‚   â”œâ”€â”€ api/
â”‚   â”‚
â”‚   â””â”€â”€ layout.tsx
â”‚
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ ui/
â”‚   â”œâ”€â”€ post/
â”‚   â”œâ”€â”€ comments/
â”‚   â”œâ”€â”€ voting/
â”‚   â”œâ”€â”€ polling/
â”‚   â”œâ”€â”€ community/
â”‚   â””â”€â”€ animations/
â”‚
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ supabase/
â”‚   â”œâ”€â”€ validation/
â”‚   â”œâ”€â”€ rate-limit/
â”‚   â””â”€â”€ utils/
â”‚
â”œâ”€â”€ hooks/
â”‚
â”œâ”€â”€ types/
â”‚
â”œâ”€â”€ public/
â”‚
â””â”€â”€ README.md
```

---

# ðŸ“± Responsive Design

Schooldit dibuat dengan pendekatan **mobile-first**.

### Desktop

```text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Sekolah     â”‚           Feed           â”‚    Ramai     â”‚
â”‚              â”‚                          â”‚              â”‚
â”‚ ðŸ« Sekolah   â”‚       Postingan          â”‚ ðŸ”¥ #ujian    â”‚
â”‚              â”‚                          â”‚ ðŸ”¥ #pensi    â”‚
â”‚              â”‚       Postingan          â”‚ ðŸ”¥ #osis     â”‚
â”‚              â”‚                          â”‚              â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Mobile

```text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚      ðŸŽ“ SCHOOLDIT    â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                      â”‚
â”‚      Postingan       â”‚
â”‚                      â”‚
â”‚      Postingan       â”‚
â”‚                      â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ ðŸ   ðŸ”¥  ï¼‹  ðŸ”  â˜° â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

# ðŸš€ Installation

Clone repository:

```bash
git clone https://github.com/username/schooldit.git
cd schooldit
```

Install dependencies:

```bash
npm install
```

Buat `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Jalankan development server:

```bash
npm run dev
```

Buka:

```text
http://localhost:3000
```

---

# â˜ï¸ Deployment

Schooldit dirancang untuk deployment menggunakan **Vercel**.

```text
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚    Vercel    â”‚
                    â”‚   Next.js    â”‚
                    â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜
                           â”‚
                 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                 â”‚                   â”‚
          Server Actions        Route Handlers
                 â”‚                   â”‚
                 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                           â”‚
                    â”Œâ”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”
                    â”‚   Supabase  â”‚
                    â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
                    â”‚ PostgreSQL  â”‚
                    â”‚ Realtime    â”‚
                    â”‚ Storage     â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

# ðŸ—ºï¸ Roadmap

## 01 â€” Fondasi

- [ ] Setup Next.js
- [ ] Setup Supabase
- [ ] Database schema
- [ ] Layout utama
- [ ] Responsive navigation
- [ ] Light mode
- [ ] Dark mode
- [ ] System theme

## 02 â€” Community

- [ ] Sekolah
- [ ] School feed
- [ ] Anonymous session
- [ ] Anonymous posting
- [ ] Post flair
- [ ] Thread
- [ ] Comments

## 03 â€” Interaksi

- [ ] Upvote
- [ ] Downvote
- [ ] Nested comments
- [ ] Polling
- [ ] Trending
- [ ] Realtime updates

## 04 â€” Media

- [ ] Image upload
- [ ] Video upload
- [ ] PDF upload
- [ ] File preview
- [ ] Upload progress
- [ ] Storage limits

## 05 â€” Experience

- [ ] Micro-interactions
- [ ] Animated voting
- [ ] Smooth page transitions
- [ ] Comment animations
- [ ] Skeleton loading
- [ ] Toast notifications
- [ ] Empty states
- [ ] Optimistic UI

## 06 â€” Moderation

- [ ] Report system
- [ ] Admin dashboard
- [ ] Rate limiting
- [ ] Spam protection
- [ ] File validation
- [ ] Content removal

## 07 â€” Production

- [ ] SEO
- [ ] Open Graph
- [ ] Accessibility
- [ ] Performance optimization
- [ ] Mobile optimization
- [ ] Vercel deployment

---

# ðŸŽ¯ Tujuan Project

Schooldit dibuat sebagai project full-stack untuk mengeksplorasi bagaimana sebuah platform komunitas modern dapat dibangun dari awal.

Project ini berfokus pada:

- Full-stack Next.js
- TypeScript
- PostgreSQL
- Supabase
- Realtime application
- Anonymous session architecture
- File storage
- Voting system
- Comment system
- Polling
- Responsive UI
- Soft UI Evolution
- Micro-interactions
- Dark & Light Mode
- Production deployment

---

# âš ï¸ Disclaimer

Schooldit adalah project eksperimental dan edukasional.

Anonimitas dibuat untuk memberikan ruang bagi pengguna untuk berdiskusi dan berbagi pengalaman dengan lebih nyaman.

Anonimitas **bukan** dimaksudkan untuk memfasilitasi:

- penyebaran data pribadi
- ancaman
- pelecehan
- doxxing
- penyebaran konten ilegal
- penyalahgunaan media

Pengguna bertanggung jawab atas konten yang mereka kirimkan.

---

<div align="center">

# ðŸŽ“ SCHOOLDIT

### tempat anak sekolah ngomong tanpa nama.

**Dibuat dengan â¤ï¸ menggunakan Next.js, Supabase & Vercel.**

</div>
