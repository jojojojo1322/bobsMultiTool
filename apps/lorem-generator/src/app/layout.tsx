import type { Metadata } from 'next';
import './globals.css';
import { TranslationProvider } from '@/contexts/TranslationContext';

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator - Multi-language Text Generator | Bob\'s Multi Tool',
  description: 'Generate Lorem Ipsum placeholder text in multiple languages including Latin, Korean, Chinese, Japanese, and Vietnamese. Free online tool for designers and developers.',
  keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'text generator', 'multilingual', 'design tool'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
} 