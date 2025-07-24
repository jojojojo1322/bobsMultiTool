export interface MetaTagsData {
  title: string;
  description: string;
  keywords: string;
  author: string;
  canonicalUrl: string;
  language: string;
  charset: string;
  
  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  fbAppId: string;
  
  // Twitter
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  twitterCreator: string;
  
  // Robots
  robotsIndex: boolean;
  robotsFollow: boolean;
  robotsArchive: boolean;
  robotsSnippet: boolean;
  robotsImageIndex: boolean;
  robotsTranslate: boolean;
  robotsMaxSnippet: string;
  robotsMaxImagePreview: string;
  robotsMaxVideoPreview: string;
  robotsUnavailableAfter: string;
  
  // Multilingual SEO
  enableHreflang: boolean;
  baseUrl: string;
}

export interface MetaTagResult {
  html: string;
  preview: {
    title: string;
    description: string;
    image?: string;
  };
}

export type TabType = 'basic' | 'social' | 'advanced'; 