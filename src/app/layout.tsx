import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bridge Cloud',
  description: 'Your unified AI workspace — Claude, Gemini, Codex, Qwen, and Free Bot in one place.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0a1410] text-[#ececec] antialiased h-screen overflow-hidden">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
