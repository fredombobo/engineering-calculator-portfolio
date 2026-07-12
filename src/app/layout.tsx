import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '工程计算工具箱 | Engineering Calculator Toolbox',
    template: '%s | Engineering Calculator',
  },
  description: '面向工程人员的 HarmonyOS 本地计算工具箱。50 个可搜索可复核的工具模块，结果可追溯，本地优先。 | A HarmonyOS native calculation toolkit with 50 reviewable tools.',
  metadataBase: new URL(process.env.SITE_URL || 'https://example.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: 'en_US',
    siteName: '工程计算工具箱',
    title: '工程计算工具箱 | Engineering Calculator Toolbox',
    description: '面向工程人员的 HarmonyOS 本地计算工具箱。50 个可搜索可复核的工具模块，结果可追溯，本地优先。',
  },
  twitter: {
    card: 'summary_large_image',
    title: '工程计算工具箱 | Engineering Calculator Toolbox',
    description: '面向工程人员的 HarmonyOS 本地计算工具箱。50 个可搜索可复核的工具模块。',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var theme = localStorage.getItem('theme');
              if (!theme) {
                theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              document.documentElement.setAttribute('data-theme', theme);
            })();
          `,
        }} />
      </head>
      <body className="font-sans bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">{children}</body>
    </html>
  );
}
