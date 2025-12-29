'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Prompt } from 'next/font/google';
import './globals.css';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-prompt',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useAppStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dark', theme === 'midnight');
    }
  }, [theme, mounted]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <html lang="th" className={prompt.variable}>
        <head>
          <title>Our Universe</title>
          <meta name="description" content="บันทึกความทรงจำของเราสองคน" />
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
          <meta name="theme-color" content="#fef7ed" media="(prefers-color-scheme: light)" />
          <meta name="theme-color" content="#0f0f23" media="(prefers-color-scheme: dark)" />
          <link rel="icon" href="/favicon.png" />
          <link rel="apple-touch-icon" href="/icon.png" />
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body className="min-h-screen font-prompt">
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-2xl">✨</div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="th" className={`${prompt.variable} ${theme === 'midnight' ? 'dark' : ''}`}>
      <head>
        <title>Our Universe</title>
        <meta name="description" content="บันทึกความทรงจำของเราสองคน" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#fef7ed" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f0f23" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen font-prompt transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
