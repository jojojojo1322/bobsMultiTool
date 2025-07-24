'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MetaTagsData, TabType } from '@/types';

const MetaGenerator = () => {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [metaData, setMetaData] = useState<MetaTagsData>({
    title: '',
    description: '',
    keywords: '',
    author: '',
    canonicalUrl: '',
    language: 'en',
    charset: 'UTF-8',
    
    // Open Graph
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogUrl: '',
    ogType: 'website',
    fbAppId: '',
    
    // Twitter
    twitterCard: 'summary',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    twitterSite: '',
    twitterCreator: '',
    
    // Robots
    robotsIndex: true,
    robotsFollow: true,
    robotsArchive: true,
    robotsSnippet: true,
    robotsImageIndex: true,
    robotsTranslate: true,
    robotsMaxSnippet: '-1',
    robotsMaxImagePreview: 'large',
    robotsMaxVideoPreview: '-1',
    robotsUnavailableAfter: '',
    
    // Multilingual SEO
    enableHreflang: true,
    baseUrl: '',
  });

  const [generatedHtml, setGeneratedHtml] = useState('');

  // 메타 태그 HTML 생성
  const generateMetaTags = (data: MetaTagsData): string => {
    const tags: string[] = [];

    // 기본 메타 태그
    if (data.title) {
      tags.push(`<title>${data.title}</title>`);
    }
    if (data.description) {
      tags.push(`<meta name="description" content="${data.description}" />`);
    }
    if (data.keywords) {
      tags.push(`<meta name="keywords" content="${data.keywords}" />`);
    }
    if (data.author) {
      tags.push(`<meta name="author" content="${data.author}" />`);
    }
    if (data.canonicalUrl) {
      tags.push(`<link rel="canonical" href="${data.canonicalUrl}" />`);
    }
    
    tags.push(`<meta charset="${data.charset}" />`);
    tags.push(`<meta name="language" content="${data.language}" />`);

    // Robots 메타 태그
    const robotsDirectives: string[] = [];
    if (data.robotsIndex) robotsDirectives.push('index');
    else robotsDirectives.push('noindex');
    
    if (data.robotsFollow) robotsDirectives.push('follow');
    else robotsDirectives.push('nofollow');
    
    if (data.robotsArchive) robotsDirectives.push('archive');
    else robotsDirectives.push('noarchive');
    
    if (data.robotsSnippet) robotsDirectives.push('snippet');
    else robotsDirectives.push('nosnippet');
    
    if (data.robotsImageIndex) robotsDirectives.push('imageindex');
    else robotsDirectives.push('noimageindex');
    
    if (data.robotsTranslate) robotsDirectives.push('translate');
    else robotsDirectives.push('notranslate');

    if (data.robotsMaxSnippet !== '-1') {
      robotsDirectives.push(`max-snippet:${data.robotsMaxSnippet}`);
    }
    
    if (data.robotsMaxImagePreview !== 'large') {
      robotsDirectives.push(`max-image-preview:${data.robotsMaxImagePreview}`);
    }
    
    if (data.robotsMaxVideoPreview !== '-1') {
      robotsDirectives.push(`max-video-preview:${data.robotsMaxVideoPreview}`);
    }
    
    if (data.robotsUnavailableAfter) {
      robotsDirectives.push(`unavailable_after:${data.robotsUnavailableAfter}`);
    }

    if (robotsDirectives.length > 0) {
      tags.push(`<meta name="robots" content="${robotsDirectives.join(', ')}" />`);
    }

    // Open Graph 태그
    if (data.ogTitle || data.title) {
      tags.push(`<meta property="og:title" content="${data.ogTitle || data.title}" />`);
    }
    if (data.ogDescription || data.description) {
      tags.push(`<meta property="og:description" content="${data.ogDescription || data.description}" />`);
    }
    if (data.ogImage) {
      tags.push(`<meta property="og:image" content="${data.ogImage}" />`);
    }
    if (data.ogUrl) {
      tags.push(`<meta property="og:url" content="${data.ogUrl}" />`);
    }
    tags.push(`<meta property="og:type" content="${data.ogType}" />`);
    if (data.fbAppId) {
      tags.push(`<meta property="fb:app_id" content="${data.fbAppId}" />`);
    }

    // Twitter 태그
    tags.push(`<meta name="twitter:card" content="${data.twitterCard}" />`);
    if (data.twitterTitle || data.title) {
      tags.push(`<meta name="twitter:title" content="${data.twitterTitle || data.title}" />`);
    }
    if (data.twitterDescription || data.description) {
      tags.push(`<meta name="twitter:description" content="${data.twitterDescription || data.description}" />`);
    }
    if (data.twitterImage || data.ogImage) {
      tags.push(`<meta name="twitter:image" content="${data.twitterImage || data.ogImage}" />`);
    }
    if (data.twitterSite) {
      tags.push(`<meta name="twitter:site" content="${data.twitterSite}" />`);
    }
    if (data.twitterCreator) {
      tags.push(`<meta name="twitter:creator" content="${data.twitterCreator}" />`);
    }

    // Multilingual SEO - Hreflang links
    if (data.enableHreflang && data.baseUrl) {
      const languages = ['ko', 'en', 'zh', 'ja', 'vi'];
      const languageNames = {
        'ko': 'ko-KR',
        'en': 'en-US', 
        'zh': 'zh-CN',
        'ja': 'ja-JP',
        'vi': 'vi-VN'
      };
      
      languages.forEach(lang => {
        const hreflangCode = languageNames[lang as keyof typeof languageNames];
        const url = `${data.baseUrl}?lang=${lang}`;
        tags.push(`<link rel="alternate" hreflang="${hreflangCode}" href="${url}" />`);
      });
      
      // X-default for international targeting
      tags.push(`<link rel="alternate" hreflang="x-default" href="${data.baseUrl}" />`);
    }

    // Additional multilingual meta tags
    if (data.enableHreflang) {
      tags.push(`<meta name="google" content="notranslate" />`);
      tags.push(`<meta http-equiv="content-language" content="${data.language}" />`);
    }

    return tags.join('\n');
  };

  // 데이터 변경 시 HTML 재생성
  useEffect(() => {
    const html = generateMetaTags(metaData);
    setGeneratedHtml(html);
  }, [metaData]);

  // 폼 데이터 업데이트
  const updateMetaData = (field: keyof MetaTagsData, value: string | boolean) => {
    setMetaData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 샘플 템플릿들 (다국어 지원)
  const getSampleTemplates = () => {
    const templates = {
      website: {
        ko: {
          title: 'Bob\'s Multi Tool - 개발자를 위한 실용적인 온라인 도구들',
          description: '웹 개발하면서 자주 쓰는 도구들을 한 곳에 모았습니다. iframe 뷰어로 반응형 디자인 테스트하고, 정규식 테스터로 패턴 검증해보세요.',
          keywords: '개발자 도구, 웹 개발, iframe 뷰어, 정규식 테스터, 무료 도구',
          author: 'Bob\'s Multi Tool Team',
          ogTitle: 'Bob\'s Multi Tool - 개발자 도구 모음집',
          ogDescription: '웹 개발하면서 자주 쓰는 도구들을 한 곳에 모았습니다.',
        },
        en: {
          title: 'Bob\'s Multi Tool - Practical Online Tools for Developers',
          description: 'Essential web development tools in one place. Test responsive designs with iframe viewer and validate patterns with regex tester.',
          keywords: 'developer tools, web development, iframe viewer, regex tester, free tools',
          author: 'Bob\'s Multi Tool Team',
          ogTitle: 'Bob\'s Multi Tool - Developer Tools Collection',
          ogDescription: 'Essential web development tools gathered in one convenient place.',
        },
        zh: {
          title: 'Bob\'s Multi Tool - 开发者实用在线工具集',
          description: '将网页开发中常用的工具集中在一处。使用iframe查看器测试响应式设计，用正则表达式测试器验证模式。',
          keywords: '开发者工具, 网页开发, iframe查看器, 正则表达式测试器, 免费工具',
          author: 'Bob\'s Multi Tool Team',
          ogTitle: 'Bob\'s Multi Tool - 开发者工具集合',
          ogDescription: '将网页开发中常用的工具集中在一处。',
        },
        ja: {
          title: 'Bob\'s Multi Tool - 開発者のための実用的オンラインツール',
          description: 'ウェブ開発でよく使うツールを一箇所に集めました。iframeビューアーでレスポンシブデザインをテストし、正規表現テスターでパターンを検証できます。',
          keywords: '開発者ツール, ウェブ開発, iframeビューアー, 正規表現テスター, 無料ツール',
          author: 'Bob\'s Multi Tool Team',
          ogTitle: 'Bob\'s Multi Tool - 開発者ツール集',
          ogDescription: 'ウェブ開発でよく使うツールを一箇所に集めました。',
        },
        vi: {
          title: 'Bob\'s Multi Tool - Công Cụ Trực Tuyến Thực Tế Cho Developers',
          description: 'Tập hợp các công cụ phát triển web thường dùng tại một nơi. Test responsive design với iframe viewer và kiểm tra pattern với regex tester.',
          keywords: 'công cụ developer, phát triển web, iframe viewer, regex tester, công cụ miễn phí',
          author: 'Bob\'s Multi Tool Team',
          ogTitle: 'Bob\'s Multi Tool - Bộ Sưu Tập Công Cụ Developer',
          ogDescription: 'Tập hợp các công cụ phát triển web thường dùng tại một nơi.',
        }
      },
      blog: {
        ko: {
          title: 'React 19의 새로운 기능들과 마이그레이션 가이드',
          description: 'React 19에서 추가된 Server Components, Actions, 그리고 새로운 Hooks들을 살펴보고 기존 프로젝트를 어떻게 마이그레이션할지 알아봅시다.',
          keywords: 'React 19, Server Components, React Actions, React Hooks, 마이그레이션',
          author: 'Bob Kim',
          ogTitle: 'React 19의 새로운 기능들과 마이그레이션 가이드',
          ogDescription: 'React 19에서 추가된 Server Components, Actions, 그리고 새로운 Hooks들을 살펴보고 마이그레이션 방법을 알아봅시다.',
        },
        en: {
          title: 'React 19 New Features and Migration Guide',
          description: 'Explore the Server Components, Actions, and new Hooks added in React 19, and learn how to migrate your existing projects.',
          keywords: 'React 19, Server Components, React Actions, React Hooks, migration',
          author: 'Bob Kim',
          ogTitle: 'React 19 New Features and Migration Guide',
          ogDescription: 'Learn about React 19\'s Server Components, Actions, and new Hooks with migration strategies.',
        },
        zh: {
          title: 'React 19新功能和迁移指南',
          description: '了解React 19中添加的Server Components、Actions和新的Hooks，学习如何迁移现有项目。',
          keywords: 'React 19, Server Components, React Actions, React Hooks, 迁移',
          author: 'Bob Kim',
          ogTitle: 'React 19新功能和迁移指南',
          ogDescription: '了解React 19的Server Components、Actions和新Hooks以及迁移方法。',
        },
        ja: {
          title: 'React 19の新機能とマイグレーションガイド',
          description: 'React 19で追加されたServer Components、Actions、新しいHooksを確認し、既存プロジェクトの移行方法を学びましょう。',
          keywords: 'React 19, Server Components, React Actions, React Hooks, マイグレーション',
          author: 'Bob Kim',
          ogTitle: 'React 19の新機能とマイグレーションガイド',
          ogDescription: 'React 19のServer Components、Actions、新しいHooksとマイグレーション方法について。',
        },
        vi: {
          title: 'Tính Năng Mới React 19 và Hướng Dẫn Di Chuyển',
          description: 'Khám phá Server Components, Actions và các Hooks mới được thêm trong React 19, và học cách di chuyển các dự án hiện tại.',
          keywords: 'React 19, Server Components, React Actions, React Hooks, di chuyển',
          author: 'Bob Kim',
          ogTitle: 'Tính Năng Mới React 19 và Hướng Dẫn Di Chuyển',
          ogDescription: 'Tìm hiểu về Server Components, Actions và Hooks mới của React 19 cùng chiến lược di chuyển.',
        }
      },
      product: {
        ko: {
          title: 'MacBook Pro M3 - 최고의 성능을 경험하세요',
          description: '새로운 M3 칩셋으로 더욱 강력해진 MacBook Pro. 창작자와 개발자를 위한 궁극의 노트북을 지금 만나보세요.',
          keywords: 'MacBook Pro, M3 칩, 노트북, 애플, 창작자, 개발자',
          author: 'Apple Inc.',
          ogTitle: 'MacBook Pro M3 - 최고의 성능을 경험하세요',
          ogDescription: '새로운 M3 칩셋으로 더욱 강력해진 MacBook Pro. 창작자와 개발자를 위한 궁극의 노트북.',
        },
        en: {
          title: 'MacBook Pro M3 - Experience Ultimate Performance',
          description: 'MacBook Pro powered by the new M3 chip delivers unprecedented performance. The ultimate laptop for creators and developers.',
          keywords: 'MacBook Pro, M3 chip, laptop, Apple, creators, developers',
          author: 'Apple Inc.',
          ogTitle: 'MacBook Pro M3 - Experience Ultimate Performance',
          ogDescription: 'MacBook Pro with M3 chip delivers unprecedented performance for creators and developers.',
        },
        zh: {
          title: 'MacBook Pro M3 - 体验终极性能',
          description: '搭载全新M3芯片的MacBook Pro性能更加强劲。为创作者和开发者打造的终极笔记本电脑。',
          keywords: 'MacBook Pro, M3芯片, 笔记本电脑, 苹果, 创作者, 开发者',
          author: 'Apple Inc.',
          ogTitle: 'MacBook Pro M3 - 体验终极性能',
          ogDescription: '搭载M3芯片的MacBook Pro为创作者和开发者提供强劲性能。',
        },
        ja: {
          title: 'MacBook Pro M3 - 究極のパフォーマンスを体験',
          description: '新しいM3チップを搭載したMacBook Proは、より強力なパフォーマンスを実現。クリエイターと開発者のための究極のノートブック。',
          keywords: 'MacBook Pro, M3チップ, ノートブック, Apple, クリエイター, 開発者',
          author: 'Apple Inc.',
          ogTitle: 'MacBook Pro M3 - 究極のパフォーマンスを体験',
          ogDescription: 'M3チップ搭載のMacBook Proはクリエイターと開発者に究極のパフォーマンスを提供。',
        },
        vi: {
          title: 'MacBook Pro M3 - Trải Nghiệm Hiệu Suất Tối Ưu',
          description: 'MacBook Pro được trang bị chip M3 mới mang đến hiệu suất mạnh mẽ hơn. Laptop tối ưu cho nhà sáng tạo và lập trình viên.',
          keywords: 'MacBook Pro, chip M3, laptop, Apple, nhà sáng tạo, lập trình viên',
          author: 'Apple Inc.',
          ogTitle: 'MacBook Pro M3 - Trải Nghiệm Hiệu Suất Tối Ưu',
          ogDescription: 'MacBook Pro với chip M3 mang đến hiệu suất tối ưu cho nhà sáng tạo và lập trình viên.',
        }
      }
    };

    const currentLang = language as keyof typeof templates.website;
    const websiteData = templates.website[currentLang];
    const blogData = templates.blog[currentLang];
    const productData = templates.product[currentLang];

    return [
      {
        name: t('sampleWebsiteName'),
        data: {
          ...websiteData,
          canonicalUrl: 'https://bobob.app',
          ogImage: 'https://bobob.app/og-image.jpg',
          ogUrl: 'https://bobob.app',
          ogType: 'website',
          twitterCard: 'summary_large_image',
          twitterSite: '@bobob935',
          twitterCreator: '@bobob935',
          baseUrl: 'https://bobob.app'
        }
      },
      {
        name: t('sampleBlogName'),
        data: {
          ...blogData,
          canonicalUrl: 'https://blog.example.com/react-19-features',
          ogImage: 'https://blog.example.com/images/react-19-cover.jpg',
          ogUrl: 'https://blog.example.com/react-19-features',
          ogType: 'article',
          twitterCard: 'summary_large_image',
          twitterSite: '@blogsite',
          twitterCreator: '@bobkim',
          baseUrl: 'https://blog.example.com/react-19-features'
        }
      },
      {
        name: t('sampleProductName'),
        data: {
          ...productData,
          canonicalUrl: 'https://store.example.com/macbook-pro-m3',
          ogImage: 'https://store.example.com/images/macbook-pro-m3.jpg',
          ogUrl: 'https://store.example.com/macbook-pro-m3',
          ogType: 'product',
          twitterCard: 'summary_large_image',
          twitterSite: '@applestore',
          twitterCreator: '@apple',
          baseUrl: 'https://store.example.com/macbook-pro-m3'
        }
      }
    ];
  };

  const sampleTemplates = getSampleTemplates();

  // 샘플 적용 함수
  const applySample = (sample: typeof sampleTemplates[0]) => {
    setMetaData(prev => ({
      ...prev,
      ...sample.data
    }));
  };

  // 클립보드 복사
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedHtml);
      // TODO: 성공 토스트 표시
    } catch (err) {
      console.error('Copy failed:', err);
      // TODO: 실패 토스트 표시
    }
  };

  const tabs = [
    { id: 'basic' as TabType, label: t('basicTab'), icon: '📝' },
    { id: 'social' as TabType, label: t('socialTab'), icon: '📱' },
    { id: 'advanced' as TabType, label: t('advancedTab'), icon: '⚙️' },
  ];

  return (
    <div className="space-y-8">
      {/* 탭 네비게이션 */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 기본 메타 태그 */}
      {activeTab === 'basic' && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('basicMetaTitle')}
          </h2>
          
          <div className="space-y-6">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('titleLabel')}
              </label>
              <input
                type="text"
                value={metaData.title}
                onChange={(e) => updateMetaData('title', e.target.value)}
                placeholder={t('titlePlaceholder')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">{t('titleHint')}</p>
              <p className="text-xs text-gray-400 mt-1">
                {metaData.title.length}/60 characters
              </p>
            </div>

            {/* 설명 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('descriptionLabel')}
              </label>
              <textarea
                value={metaData.description}
                onChange={(e) => updateMetaData('description', e.target.value)}
                placeholder={t('descriptionPlaceholder')}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{t('descriptionHint')}</p>
              <p className="text-xs text-gray-400 mt-1">
                {metaData.description.length}/160 characters
              </p>
            </div>

            {/* 키워드 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('keywordsLabel')}
              </label>
              <input
                type="text"
                value={metaData.keywords}
                onChange={(e) => updateMetaData('keywords', e.target.value)}
                placeholder={t('keywordsPlaceholder')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">{t('keywordsHint')}</p>
            </div>

            {/* 작성자 & 정규 URL */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('authorLabel')}
                </label>
                <input
                  type="text"
                  value={metaData.author}
                  onChange={(e) => updateMetaData('author', e.target.value)}
                  placeholder={t('authorPlaceholder')}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('canonicalUrlLabel')}
                </label>
                <input
                  type="url"
                  value={metaData.canonicalUrl}
                  onChange={(e) => updateMetaData('canonicalUrl', e.target.value)}
                  placeholder={t('canonicalUrlPlaceholder')}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* 언어 & 문자셋 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('languageLabel')}
                </label>
                <select
                  value={metaData.language}
                  onChange={(e) => updateMetaData('language', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="en">English</option>
                  <option value="ko">한국어</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                  <option value="vi">Tiếng Việt</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('charsetLabel')}
                </label>
                <select
                  value={metaData.charset}
                  onChange={(e) => updateMetaData('charset', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="UTF-8">UTF-8</option>
                  <option value="UTF-16">UTF-16</option>
                  <option value="ISO-8859-1">ISO-8859-1</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 소셜 미디어 탭 */}
      {activeTab === 'social' && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('socialMetaTitle')}
          </h2>
          
          <div className="space-y-8">
            {/* Open Graph 섹션 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Open Graph (Facebook, LinkedIn)</h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('ogTitleLabel')}
                    </label>
                    <input
                      type="text"
                      value={metaData.ogTitle}
                      onChange={(e) => updateMetaData('ogTitle', e.target.value)}
                      placeholder={metaData.title || t('titlePlaceholder')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">기본값: 페이지 제목과 동일</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('ogTypeLabel')}
                    </label>
                    <select
                      value={metaData.ogType}
                      onChange={(e) => updateMetaData('ogType', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="website">{t('ogTypeLabelWebsite')}</option>
                      <option value="article">{t('ogTypeLabelArticle')}</option>
                      <option value="product">{t('ogTypeLabelProduct')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('ogDescriptionLabel')}
                  </label>
                  <textarea
                    value={metaData.ogDescription}
                    onChange={(e) => updateMetaData('ogDescription', e.target.value)}
                    placeholder={metaData.description || t('descriptionPlaceholder')}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">기본값: 메타 설명과 동일</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('ogImageLabel')}
                    </label>
                    <input
                      type="url"
                      value={metaData.ogImage}
                      onChange={(e) => updateMetaData('ogImage', e.target.value)}
                      placeholder={t('ogImagePlaceholder')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('ogUrlLabel')}
                    </label>
                    <input
                      type="url"
                      value={metaData.ogUrl}
                      onChange={(e) => updateMetaData('ogUrl', e.target.value)}
                      placeholder={metaData.canonicalUrl || "https://example.com"}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('fbAppIdLabel')}
                  </label>
                  <input
                    type="text"
                    value={metaData.fbAppId}
                    onChange={(e) => updateMetaData('fbAppId', e.target.value)}
                    placeholder={t('fbAppIdPlaceholder')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Twitter 섹션 */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('twitterSectionTitle')}</h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('twitterCardLabel')}
                    </label>
                    <select
                      value={metaData.twitterCard}
                      onChange={(e) => updateMetaData('twitterCard', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="summary">{t('twitterCardSummary')}</option>
                      <option value="summary_large_image">{t('twitterCardLargeImage')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('twitterImageLabel')}
                    </label>
                    <input
                      type="url"
                      value={metaData.twitterImage}
                      onChange={(e) => updateMetaData('twitterImage', e.target.value)}
                      placeholder={metaData.ogImage || "https://example.com/image.jpg"}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('twitterTitleLabel')}
                    </label>
                    <input
                      type="text"
                      value={metaData.twitterTitle}
                      onChange={(e) => updateMetaData('twitterTitle', e.target.value)}
                      placeholder={metaData.ogTitle || metaData.title || t('titlePlaceholder')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('twitterDescriptionLabel')}
                    </label>
                    <input
                      type="text"
                      value={metaData.twitterDescription}
                      onChange={(e) => updateMetaData('twitterDescription', e.target.value)}
                      placeholder={metaData.ogDescription || metaData.description || t('descriptionPlaceholder')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('twitterSiteLabel')}
                    </label>
                    <input
                      type="text"
                      value={metaData.twitterSite}
                      onChange={(e) => updateMetaData('twitterSite', e.target.value)}
                      placeholder={t('twitterSitePlaceholder')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('twitterCreatorLabel')}
                    </label>
                    <input
                      type="text"
                      value={metaData.twitterCreator}
                      onChange={(e) => updateMetaData('twitterCreator', e.target.value)}
                      placeholder={t('twitterCreatorPlaceholder')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 고급 설정 탭 */}
      {activeTab === 'advanced' && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('advancedMetaTitle')}
          </h2>
          
          <div className="space-y-8">
            {/* Robots Meta Tags */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('robotsTitle')}</h3>
              
              <div className="space-y-6">
                {/* 기본 robots 지시문 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="robotsIndex"
                        checked={metaData.robotsIndex}
                        onChange={(e) => updateMetaData('robotsIndex', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="robotsIndex" className="text-sm font-medium text-gray-700">
                        {t('robotsIndexLabel')} (index/noindex)
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="robotsFollow"
                        checked={metaData.robotsFollow}
                        onChange={(e) => updateMetaData('robotsFollow', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="robotsFollow" className="text-sm font-medium text-gray-700">
                        {t('robotsFollowLabel')} (follow/nofollow)
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="robotsArchive"
                        checked={metaData.robotsArchive}
                        onChange={(e) => updateMetaData('robotsArchive', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="robotsArchive" className="text-sm font-medium text-gray-700">
                        {t('robotsArchiveLabel')} (archive/noarchive)
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="robotsSnippet"
                        checked={metaData.robotsSnippet}
                        onChange={(e) => updateMetaData('robotsSnippet', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="robotsSnippet" className="text-sm font-medium text-gray-700">
                        {t('robotsSnippetLabel')} (snippet/nosnippet)
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="robotsImageIndex"
                        checked={metaData.robotsImageIndex}
                        onChange={(e) => updateMetaData('robotsImageIndex', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="robotsImageIndex" className="text-sm font-medium text-gray-700">
                        {t('robotsImageIndexLabel')} (imageindex/noimageindex)
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="robotsTranslate"
                        checked={metaData.robotsTranslate}
                        onChange={(e) => updateMetaData('robotsTranslate', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="robotsTranslate" className="text-sm font-medium text-gray-700">
                        {t('robotsTranslateLabel')} (translate/notranslate)
                      </label>
                    </div>
                  </div>
                </div>

                {/* 고급 robots 설정 */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">고급 Robots 설정</h4>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('robotsMaxSnippetLabel')}
                      </label>
                      <select
                        value={metaData.robotsMaxSnippet}
                        onChange={(e) => updateMetaData('robotsMaxSnippet', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="-1">제한 없음</option>
                        <option value="0">스니펫 없음</option>
                        <option value="50">50자</option>
                        <option value="100">100자</option>
                        <option value="160">160자</option>
                        <option value="300">300자</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('robotsMaxImagePreviewLabel')}
                      </label>
                      <select
                        value={metaData.robotsMaxImagePreview}
                        onChange={(e) => updateMetaData('robotsMaxImagePreview', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="large">Large</option>
                        <option value="standard">Standard</option>
                        <option value="none">None</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('robotsMaxVideoPreviewLabel')}
                      </label>
                      <select
                        value={metaData.robotsMaxVideoPreview}
                        onChange={(e) => updateMetaData('robotsMaxVideoPreview', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="-1">제한 없음</option>
                        <option value="0">미리보기 없음</option>
                        <option value="30">30초</option>
                        <option value="60">60초</option>
                        <option value="120">120초</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 사용 불가 날짜 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('robotsUnavailableAfterLabel')}
                  </label>
                  <input
                    type="datetime-local"
                    value={metaData.robotsUnavailableAfter}
                    onChange={(e) => updateMetaData('robotsUnavailableAfter', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">이 날짜 이후에는 검색 결과에 표시되지 않습니다</p>
                </div>
              </div>
            </div>
            
            {/* 다국어 SEO 섹션 */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">다국어 SEO</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="enableHreflang"
                    checked={metaData.enableHreflang}
                    onChange={(e) => updateMetaData('enableHreflang', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="enableHreflang" className="text-sm font-medium text-gray-700">
                    Hreflang 태그 활성화 (다국어 웹사이트용)
                  </label>
                </div>
                
                {metaData.enableHreflang && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      기본 URL
                    </label>
                    <input
                      type="url"
                      value={metaData.baseUrl}
                      onChange={(e) => updateMetaData('baseUrl', e.target.value)}
                      placeholder="https://example.com/page"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      지원 언어: 한국어(ko), 영어(en), 중국어(zh), 일본어(ja), 베트남어(vi)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 샘플 템플릿 */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📋 {t('sampleTemplatesTitle')}
        </h2>
        <p className="text-gray-600 mb-6">{t('sampleTemplatesDescription')}</p>
        
        <div className="grid md:grid-cols-3 gap-4">
          {sampleTemplates.map((sample, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition-all duration-200"
              onClick={() => applySample(sample)}
            >
              <h3 className="font-semibold text-gray-900 mb-2">{sample.name}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {sample.data.title.length > 50 
                  ? sample.data.title.substring(0, 50) + '...' 
                  : sample.data.title}
              </p>
              <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                {t('applySampleButton')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 생성된 코드 */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('generatedCodeTitle')}
          </h2>
          <button
            onClick={copyToClipboard}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {t('copyCodeButton')}
          </button>
        </div>
        
        <pre className="bg-gray-100 border rounded-lg p-4 overflow-x-auto text-sm">
          <code className="text-gray-800">{generatedHtml || '<!-- Meta tags will appear here -->'}</code>
        </pre>
      </div>
    </div>
  );
};

export default MetaGenerator; 