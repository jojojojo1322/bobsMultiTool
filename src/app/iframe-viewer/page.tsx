import { Metadata, Viewport } from 'next';
import IframeViewer from '@/components/IframeViewer';

export const metadata: Metadata = {
  title: 'Iframe Viewer Tool - Website Preview Tool',
  description: 'A developer tool that allows you to preview websites in various device sizes. Provides real-time preview for iPhone, iPad, Desktop sizes.',
  keywords: ['iframe', 'viewer', 'responsive', 'preview', 'device', 'mobile', 'desktop', 'web development', 'tool', 'developer'],
  authors: [{ name: 'Developer' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function IframeViewerPage() {
  return <IframeViewer />;
} 