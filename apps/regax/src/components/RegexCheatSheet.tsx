'use client';

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const RegexCheatSheet = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const cheatSheetData = [
    {
      category: t('characterClassesTitle'),
      items: [
        { pattern: '.', description: 'Any character except newline' },
        { pattern: '\\d', description: 'Digit (0-9)' },
        { pattern: '\\D', description: 'Not digit' },
        { pattern: '\\w', description: 'Word character (a-z, A-Z, 0-9, _)' },
        { pattern: '\\W', description: 'Not word character' },
        { pattern: '\\s', description: 'Whitespace (space, tab, newline)' },
        { pattern: '\\S', description: 'Not whitespace' },
        { pattern: '[abc]', description: 'Any of a, b, or c' },
        { pattern: '[^abc]', description: 'Not a, b, or c' },
        { pattern: '[a-z]', description: 'Character between a & z' }
      ]
    },
    {
      category: t('anchorsTitle'),
      items: [
        { pattern: '^', description: 'Start of string' },
        { pattern: '$', description: 'End of string' },
        { pattern: '\\b', description: 'Word boundary' },
        { pattern: '\\B', description: 'Not word boundary' }
      ]
    },
    {
      category: t('quantifiersTitle'),
      items: [
        { pattern: '*', description: '0 or more' },
        { pattern: '+', description: '1 or more' },
        { pattern: '?', description: '0 or 1' },
        { pattern: '{3}', description: 'Exactly 3' },
        { pattern: '{3,}', description: '3 or more' },
        { pattern: '{3,5}', description: 'Between 3 and 5' },
        { pattern: '*?', description: '0 or more (lazy)' },
        { pattern: '+?', description: '1 or more (lazy)' },
        { pattern: '??', description: '0 or 1 (lazy)' }
      ]
    },
    {
      category: t('groupsLookaroundTitle'),
      items: [
        { pattern: '(abc)', description: 'Capture group' },
        { pattern: '(?:abc)', description: 'Non-capturing group' },
        { pattern: '(?<name>abc)', description: 'Named capture group' },
        { pattern: '(?=abc)', description: 'Positive lookahead' },
        { pattern: '(?!abc)', description: 'Negative lookahead' },
        { pattern: '(?<=abc)', description: 'Positive lookbehind' },
        { pattern: '(?<!abc)', description: 'Negative lookbehind' }
      ]
    },
    {
      category: t('flagsTitle'),
      items: [
        { pattern: 'g', description: 'Global - find all matches' },
        { pattern: 'i', description: 'Ignore case' },
        { pattern: 'm', description: 'Multiline - ^ and $ match line breaks' },
        { pattern: 's', description: 'Dotall - . matches newline' },
        { pattern: 'u', description: 'Unicode' },
        { pattern: 'y', description: 'Sticky - matches from lastIndex' }
      ]
    },
    {
      category: t('specialCharsTitle'),
      items: [
        { pattern: '\\\\', description: 'Backslash' },
        { pattern: '\\.', description: 'Period' },
        { pattern: '\\*', description: 'Asterisk' },
        { pattern: '\\+', description: 'Plus' },
        { pattern: '\\?', description: 'Question mark' },
        { pattern: '\\|', description: 'Pipe' },
        { pattern: '\\(', description: 'Opening parenthesis' },
        { pattern: '\\)', description: 'Closing parenthesis' },
        { pattern: '\\[', description: 'Opening bracket' },
        { pattern: '\\]', description: 'Closing bracket' }
      ]
    }
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
      >
        {t('cheatSheetButtonText')}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">{t('cheatSheetTitle')}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid md:grid-cols-2 gap-6">
                {cheatSheetData.map((section, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.category}</h3>
                    <div className="space-y-2">
                      {section.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-start space-x-3">
                          <code className="bg-white px-2 py-1 rounded text-sm font-mono text-green-600 flex-shrink-0">
                            {item.pattern}
                          </code>
                          <span className="text-sm text-gray-700">{item.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Examples Section */}
              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('popularExamplesTitle')}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-gray-900 mb-2">Email</div>
                      <div className="bg-gray-900 px-3 py-2 rounded-lg border">
                        <code className="text-sm font-mono text-green-400">
                          <span className="text-yellow-300">[</span>
                          <span className="text-blue-300">a-zA-Z0-9._%+-</span>
                          <span className="text-yellow-300">]</span>
                          <span className="text-white">+</span>
                          <span className="text-red-300">@</span>
                          <span className="text-yellow-300">[</span>
                          <span className="text-blue-300">a-zA-Z0-9.-</span>
                          <span className="text-yellow-300">]</span>
                          <span className="text-white">+</span>
                          <span className="text-purple-300">\.</span>
                          <span className="text-yellow-300">[</span>
                          <span className="text-blue-300">a-zA-Z</span>
                          <span className="text-yellow-300">]</span>
                          <span className="text-orange-300">{'{'}</span>
                          <span className="text-pink-300">2,</span>
                          <span className="text-orange-300">{'}'}</span>
                        </code>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-2">Phone (US)</div>
                      <div className="bg-gray-900 px-3 py-2 rounded-lg border">
                        <code className="text-sm font-mono text-green-400">
                          <span className="text-purple-300">\\(</span>
                          <span className="text-blue-300">\\d</span>
                          <span className="text-orange-300">{'{'}</span>
                          <span className="text-pink-300">3</span>
                          <span className="text-orange-300">{'}'}</span>
                          <span className="text-purple-300">\\)</span>
                          <span className="text-blue-300">\\s</span>
                          <span className="text-white">?</span>
                          <span className="text-blue-300">\\d</span>
                          <span className="text-orange-300">{'{'}</span>
                          <span className="text-pink-300">3</span>
                          <span className="text-orange-300">{'}'}</span>
                          <span className="text-white">-</span>
                          <span className="text-blue-300">\\d</span>
                          <span className="text-orange-300">{'{'}</span>
                          <span className="text-pink-300">4</span>
                          <span className="text-orange-300">{'}'}</span>
                        </code>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-2">URL</div>
                      <div className="bg-gray-900 px-3 py-2 rounded-lg border">
                        <code className="text-sm font-mono text-green-400">
                          <span className="text-cyan-300">https</span>
                          <span className="text-white">?</span>
                          <span className="text-red-300">://</span>
                          <span className="text-yellow-300">[</span>
                          <span className="text-blue-300">a-zA-Z0-9.-</span>
                          <span className="text-yellow-300">]</span>
                          <span className="text-white">+</span>
                          <span className="text-gray-400">(?:</span>
                          <span className="text-white">/</span>
                          <span className="text-yellow-300">[</span>
                          <span className="text-red-300">^</span>
                          <span className="text-blue-300">\\s</span>
                          <span className="text-yellow-300">]</span>
                          <span className="text-white">*</span>
                          <span className="text-gray-400">)?</span>
                        </code>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-gray-900 mb-2">Korean Phone</div>
                      <div className="bg-gray-900 px-3 py-2 rounded-lg border">
                        <code className="text-sm font-mono text-green-400">
                          <span className="text-cyan-300">01</span>
                          <span className="text-yellow-300">[</span>
                          <span className="text-blue-300">016789</span>
                          <span className="text-yellow-300">]</span>
                          <span className="text-white">-</span>
                          <span className="text-blue-300">\\d</span>
                          <span className="text-orange-300">{'{'}</span>
                          <span className="text-pink-300">3,4</span>
                          <span className="text-orange-300">{'}'}</span>
                          <span className="text-white">-</span>
                          <span className="text-blue-300">\\d</span>
                          <span className="text-orange-300">{'{'}</span>
                          <span className="text-pink-300">4</span>
                          <span className="text-orange-300">{'}'}</span>
                        </code>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-2">IP Address</div>
                      <div className="bg-gray-900 px-3 py-2 rounded-lg border">
                        <code className="text-sm font-mono text-green-400">
                          <span className="text-purple-300">\\b</span>
                          <span className="text-gray-400">(?:</span>
                          <span className="text-yellow-300">[</span>
                          <span className="text-blue-300">0-9</span>
                          <span className="text-yellow-300">]</span>
                          <span className="text-orange-300">{'{'}</span>
                          <span className="text-pink-300">1,3</span>
                          <span className="text-orange-300">{'}'}</span>
                          <span className="text-purple-300">\\.</span>
                          <span className="text-gray-400">)</span>
                          <span className="text-orange-300">{'{'}</span>
                          <span className="text-pink-300">3</span>
                          <span className="text-orange-300">{'}'}</span>
                          <span className="text-yellow-300">[</span>
                          <span className="text-blue-300">0-9</span>
                          <span className="text-yellow-300">]</span>
                          <span className="text-orange-300">{'{'}</span>
                          <span className="text-pink-300">1,3</span>
                          <span className="text-orange-300">{'}'}</span>
                          <span className="text-purple-300">\\b</span>
                        </code>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-2">Hex Color</div>
                      <div className="bg-gray-900 px-3 py-2 rounded-lg border">
                        <code className="text-sm font-mono text-green-400">
                          <span className="text-red-300">#</span>
                          <span className="text-yellow-300">[</span>
                          <span className="text-blue-300">a-fA-F0-9</span>
                          <span className="text-yellow-300">]</span>
                          <span className="text-orange-300">{'{'}</span>
                          <span className="text-pink-300">6</span>
                          <span className="text-orange-300">{'}'}</span>
                          <span className="text-purple-300">\\b</span>
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegexCheatSheet; 