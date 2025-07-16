import { Metadata, Viewport } from 'next';
import IframeViewer from '@/components/IframeViewer';

export const metadata: Metadata = {
  title: 'Iframe Viewer Tool - 웹사이트 미리보기 도구',
  description: '다양한 디바이스 크기로 웹사이트를 미리보기할 수 있는 개발자 도구입니다. iPhone, iPad, Desktop 크기로 실시간 미리보기를 제공합니다.',
  keywords: ['iframe', 'viewer', 'responsive', 'preview', 'device', 'mobile', 'desktop', 'web development'],
  authors: [{ name: 'Developer' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function IframeViewerPage() {
  return <IframeViewer />;
} 