import type { Metadata } from 'next';
import { IBM_Plex_Sans, Noto_Sans } from 'next/font/google';
import './globals.css';
import { SchoolditProvider } from '@/lib/store';
import { ToastProvider } from '@/components/ui/Toast';
import { Header } from '@/components/layout/Header';
import { SidebarLeft } from '@/components/layout/SidebarLeft';
import { SidebarRight } from '@/components/layout/SidebarRight';
import { BottomNav } from '@/components/layout/BottomNav';

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Schooldit — Tempat Anak Sekolah Ngomong Tanpa Nama',
  description:
    'Komunitas forum anonim modern untuk siswa di Indonesia. Bebas berekspresi, no cepu, no baper.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${ibmPlexSans.variable} ${notoSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-[#f4f6f8] dark:bg-[#070a12] text-slate-900 dark:text-slate-100 transition-colors pb-16 md:pb-0 font-sans antialiased">
        <SchoolditProvider>
          <ToastProvider>
            {/* Top Fixed Reddit-Style Header */}
            <Header />

            {/* Reddit Full-Width Shell: Left Drawer flush to edge + Centered Main Feed + Right Sidebar */}
            <div className="w-full flex-1 flex">
              {/* Left Sidebar Flush to Left Edge */}
              <div className="hidden md:block shrink-0">
                <SidebarLeft />
              </div>

              {/* Center Feed & Right Sidebar Container */}
              <div className="flex-1 flex justify-center py-4 px-3 sm:px-6 gap-6 min-w-0">
                {/* Main Middle Feed */}
                <main className="flex-1 max-w-2xl min-w-0">{children}</main>

                {/* Right Sidebar */}
                <div className="hidden lg:block shrink-0">
                  <div className="sticky top-18">
                    <SidebarRight />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNav />
          </ToastProvider>
        </SchoolditProvider>
      </body>
    </html>
  );
}
