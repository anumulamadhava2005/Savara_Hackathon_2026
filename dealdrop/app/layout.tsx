import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from 'next/font/google';
import Script from 'next/script';
import AgentBridge from '@/components/AgentBridge';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

const vietnam = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-vietnam',
});

export const metadata: Metadata = {
  title: 'DealDrop',
  description: 'Hyperlocal flash sale platform connecting local retailers with nearby customers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${jakarta.variable} ${vietnam.variable} antialiased bg-surface text-on-surface font-body min-h-screen relative`}>
        {children}
        <AgentBridge />

        {/* Levrage AI Voice Widget */}
        <Script
          src="https://studio.levrage.ai/embed.js"
          strategy="afterInteractive"
          data-agent-id="7e268fb8-ebcf-4d03-bd14-c07c63fdcd7d"
          data-user-id="f2c8c709-e30a-4dd2-a4cd-6cc94c2fb3e3"
          data-embed-key="lev_somMa4MKy2gkVgccMTwrpX5GPyRKs5SgGA_DSL2sotw"
          data-style="glass"
          data-mode="voice"
          data-theme="dark"
          data-position="bottom-right"
          data-primary="#a0836e"
          data-secondary="#1f2937"
          data-primary-light="#0ea5e9"
          data-secondary-light="#f3f4f6"
          data-radius="16"
          data-blur="12"
          data-opacity="0.6"
          data-logo="data:image/png;base64,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"
          data-track-navigation="true"
          data-track-forms="true"
          data-track-selection="true"
          data-track-scroll="true"
          data-track-exit="true"
          data-track-idle="true"
        />
      </body>
    </html>
  );
}
