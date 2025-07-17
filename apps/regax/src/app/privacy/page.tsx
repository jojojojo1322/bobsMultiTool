import { Metadata } from 'next';
import Link from 'next/link';
// import AdContainer from '@/components/AdContainer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Iframe Viewer tool. Learn how we protect your data and privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 광고 */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-center">
          {/* <AdContainer size="leaderboard" slot="privacy-top" isPreview={true} /> */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-700 flex items-center mb-4"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Iframe Viewer
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>Information We Collect</h2>
            <p>
              Iframe Viewer is a free tool that respects your privacy. We collect minimal information to provide our service:
            </p>
            <ul>
              <li><strong>Usage Analytics:</strong> We use Google Analytics to understand how users interact with our tool</li>
              <li><strong>URLs Entered:</strong> URLs you enter are processed client-side and not stored on our servers</li>
              <li><strong>Browser Information:</strong> Basic browser and device information for optimization</li>
            </ul>

            <h2>How We Use Information</h2>
            <p>The information we collect is used to:</p>
            <ul>
              <li>Improve the functionality of the Iframe Viewer tool</li>
              <li>Understand usage patterns to enhance user experience</li>
              <li>Display relevant advertisements through Google AdSense</li>
            </ul>

            <h2>Advertising</h2>
            <p>
              We use Google AdSense to display advertisements. Google may use cookies and other tracking technologies 
                             to serve ads based on your interests. You can learn more about Google&apos;s advertising policies and 
               opt-out options at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google&apos;s Ad Settings</a>.
            </p>

            <h2>Cookies</h2>
            <p>
              Our website uses cookies for:
            </p>
            <ul>
              <li>Remembering your language preferences</li>
              <li>Analytics and performance monitoring</li>
              <li>Advertisement personalization (Google AdSense)</li>
            </ul>

            <h2>Data Security</h2>
            <p>
                             We implement appropriate security measures to protect your information. Since we don&apos;t store 
               personal data on our servers, your privacy is inherently protected.
            </p>

            <h2>Third-Party Services</h2>
            <p>Our tool integrates with:</p>
            <ul>
              <li><strong>Google Analytics:</strong> For usage analytics</li>
              <li><strong>Google AdSense:</strong> For displaying advertisements</li>
            </ul>

            <h2>Changes to Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on this page 
              with an updated revision date.
            </p>

            <h2>Contact</h2>
            <p>
              If you have questions about this privacy policy, please contact us through our website.
            </p>
          </div>

          {/* 중간 광고 */}
          <div className="my-12 flex justify-center">
            {/* <AdContainer size="large-rectangle" slot="privacy-middle" isPreview={true} /> */}
          </div>
        </div>
      </div>

      {/* 하단 광고 */}
      <div className="w-full bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-center">
          {/* <AdContainer size="leaderboard" slot="privacy-bottom" isPreview={true} /> */}
        </div>
      </div>
    </div>
  );
} 