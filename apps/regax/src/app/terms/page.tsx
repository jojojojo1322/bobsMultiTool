import { Metadata } from 'next';
import Link from 'next/link';
// import AdContainer from '@/components/AdContainer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Iframe Viewer tool. Read our terms and conditions.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 광고 */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-center">
          {/* <AdContainer size="leaderboard" slot="terms-top" isPreview={true} /> */}
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
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using the Iframe Viewer tool, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>

            <h2>Description of Service</h2>
            <p>
              Iframe Viewer is a free online tool that allows users to preview websites in different device 
              sizes and generate iframe code. The service is provided &quot;as is&quot; without any warranties.
            </p>

            <h2>Acceptable Use</h2>
            <p>You agree to use this service only for lawful purposes. You must not:</p>
            <ul>
              <li>Use the service to view or frame copyrighted content without permission</li>
              <li>Attempt to disrupt or interfere with the service</li>
              <li>Use automated tools to access the service excessively</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>
              The Iframe Viewer tool and its original content, features, and functionality are owned by 
              the service provider and are protected by copyright and other intellectual property laws.
            </p>

            <h2>User Content</h2>
            <p>
              URLs entered into the tool are processed client-side and are not stored on our servers. 
              You are responsible for ensuring you have the right to view and frame the websites you access.
            </p>

            <h2>Third-Party Content</h2>
            <p>
              The service allows you to view third-party websites. We are not responsible for the content, 
              accuracy, or legality of third-party websites accessed through our tool.
            </p>

            {/* 중간 광고 */}
            <div className="my-12 flex justify-center">
              {/* <AdContainer size="large-rectangle" slot="terms-middle" isPreview={true} /> */}
            </div>

            <h2>Disclaimer of Warranties</h2>
            <p>
              The service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee 
              that the service will be uninterrupted, error-free, or secure.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              In no event shall the service provider be liable for any indirect, incidental, special, 
              or consequential damages arising out of or in connection with your use of the service.
            </p>

            <h2>Advertising</h2>
            <p>
              Our service displays advertisements through Google AdSense. We are not responsible for 
              the content of these advertisements or the websites they link to.
            </p>

            <h2>Modifications to Service</h2>
            <p>
              We reserve the right to modify or discontinue the service at any time without notice. 
              We may also update these terms of service from time to time.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your access to the service immediately, without prior notice 
              or liability, for any reason whatsoever.
            </p>

            <h2>Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with applicable laws, 
              without regard to conflict of law provisions.
            </p>

            <h2>Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us through our website.
            </p>
          </div>
        </div>
      </div>

      {/* 하단 광고 */}
      <div className="w-full bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-center">
          {/* <AdContainer size="leaderboard" slot="terms-bottom" isPreview={true} /> */}
        </div>
      </div>
    </div>
  );
} 