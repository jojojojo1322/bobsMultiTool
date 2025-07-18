'use client';

import IframeViewer from "@/components/IframeViewer";
import IframeViewerDescription from "@/components/IframeViewerDescription";
import ProTipsContent from "@/components/ProTipsContent";
import { TranslationProvider } from "@/contexts/TranslationContext";
// import AdContainer from "@/components/AdContainer";

export default function Home() {
  return (
    <TranslationProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* 메인 도구 영역 */}
          <div className="mb-8">
            <IframeViewer />
          </div>
          
          {/* SEO용 도구 설명 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <IframeViewerDescription />
          </div>
          
          {/* 광고 공간 */}
          <div className="flex justify-center mb-8">
            {/* <AdContainer /> */}
          </div>
          
          {/* Pro Tips */}
          <ProTipsContent />
          
          {/* 광고 공간 */}
          <div className="flex justify-center mb-8">
            {/* <AdContainer /> */}
          </div>
          
          {/* 추가 광고 공간 */}
          <div className="mb-6 flex justify-center">
            {/* <AdContainer /> */}
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">🖼️ Bob&apos;s Multi Tool - Iframe Viewer</h3>
              <div className="flex justify-center space-x-6 text-sm text-gray-400 mb-3">
                <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="mailto:bobob935@gmail.com" className="hover:text-white transition-colors">Contact Us</a>
                <a href="https://bobob.app" className="hover:text-white transition-colors">← Back to Home</a>
              </div>
              <p className="text-xs text-gray-500">
                📧 For support or questions: <a href="mailto:bobob935@gmail.com" className="text-blue-400 hover:text-blue-300">bobob935@gmail.com</a>
              </p>
            </div>
            <p className="text-sm text-gray-400">© 2024 Bob&apos;s Multi Tool. Free tools for web developers.</p>
          </div>
        </footer>
      </div>
    </TranslationProvider>
  );
}
