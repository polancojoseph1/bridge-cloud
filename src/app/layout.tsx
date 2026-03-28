import type { Metadata, Viewport } from 'next';
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Provide a dummy test key as fallback so testing environments don't crash
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_live_Y2xlcmsuY2xlcmsuY29tJA==";

  return (
    <ClerkProvider publishableKey={clerkKey} telemetry={{ disabled: true }}>
      <html lang="en" className={inter.variable}>
        <body className="bg-[#0a1410] text-[#ececec] antialiased h-screen overflow-hidden">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
