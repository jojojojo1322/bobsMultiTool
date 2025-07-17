'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import RegexExplainer from './RegexExplainer';

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
  namedGroups: { [key: string]: string };
}

interface RegexResult {
  isValid: boolean;
  error?: string;
  matches: MatchResult[];
  totalMatches: number;
}

const RegexTester = () => {
  const { t } = useTranslation();
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [result, setResult] = useState<RegexResult>({ isValid: false, matches: [], totalMatches: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // 미리 정의된 패턴들
  const commonPatterns = [
    { name: t('emailPatternName'), pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', description: t('emailPatternDesc') },
    { name: t('phoneUSPatternName'), pattern: '\\(\\d{3}\\)\\s?\\d{3}-\\d{4}', description: t('phoneUSPatternDesc') },
    { name: t('urlPatternName'), pattern: 'https?://[a-zA-Z0-9.-]+(?:/[^\\s]*)?', description: t('urlPatternDesc') },
    { name: t('ipPatternName'), pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b', description: t('ipPatternDesc') },
    { name: t('datePatternName'), pattern: '\\b\\d{1,2}/\\d{1,2}/\\d{4}\\b', description: t('datePatternDesc') },
    { name: t('creditCardPatternName'), pattern: '\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b', description: t('creditCardPatternDesc') },
    { name: t('hexColorPatternName'), pattern: '#[a-fA-F0-9]{6}\\b', description: t('hexColorPatternDesc') },
    { name: t('koreanPhonePatternName'), pattern: '01[016789]-\\d{3,4}-\\d{4}', description: t('koreanPhonePatternDesc') }
  ];

  const testRegex = (pattern: string, flags: string, testString: string): RegexResult => {
    if (!pattern) {
      return { isValid: false, matches: [], totalMatches: 0 };
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches: MatchResult[] = [];
      let match;
      
      if (flags.includes('g')) {
        // Global flag - find all matches
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups || {}
          });
          
          // Prevent infinite loop on zero-length matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        // Single match
        match = regex.exec(testString);
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups || {}
          });
        }
      }

      return {
        isValid: true,
        matches,
        totalMatches: matches.length
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Invalid regex pattern',
        matches: [],
        totalMatches: 0
      };
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const newResult = testRegex(pattern, flags, testString);
      setResult(newResult);
      setIsLoading(false);
    }, 200); // Debounce for 200ms

    return () => clearTimeout(timeoutId);
  }, [pattern, flags, testString]);

  const highlightMatches = (text: string, matches: MatchResult[]): React.ReactElement => {
    if (matches.length === 0) {
      return <span className="text-gray-600">{text}</span>;
    }

    const parts: React.ReactElement[] = [];
    let lastIndex = 0;
    
    // 색상 팔레트 - 여러 매치를 구분하기 위해
    const colors = [
      'bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300 text-blue-900',
      'bg-gradient-to-r from-green-100 to-green-200 border-green-300 text-green-900',
      'bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300 text-purple-900',
      'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-300 text-orange-900',
      'bg-gradient-to-r from-pink-100 to-pink-200 border-pink-300 text-pink-900',
      'bg-gradient-to-r from-teal-100 to-teal-200 border-teal-300 text-teal-900',
    ];

    matches.forEach((match, idx) => {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`before-${idx}`} className="text-gray-700">
            {text.slice(lastIndex, match.index)}
          </span>
        );
      }

      // Add highlighted match with rotating colors
      const colorClass = colors[idx % colors.length];
      parts.push(
        <span 
          key={`match-${idx}`}
          className={`${colorClass} border-2 rounded-md px-2 py-0.5 font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer`}
          title={`${t('matchText')} ${idx + 1}: "${match.match}" at position ${match.index}`}
        >
          {match.match}
        </span>
      );

      lastIndex = match.index + match.match.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key="after" className="text-gray-700">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return <>{parts}</>;
  };

  const loadPattern = (patternData: typeof commonPatterns[0]) => {
    setPattern(patternData.pattern);
    setFlags('g');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // 여기에 성공 메시지 토스트를 추가할 수 있습니다
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="grid gap-6">
        {/* Pattern Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('patternLabel')}
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-lg">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={t('patternPlaceholder')}
              className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-gray-900 placeholder-gray-500 ${
                result.error ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            <span className="text-gray-500 text-lg">/</span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder={t('flagPlaceholder')}
              className="w-20 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-center text-gray-900 placeholder-gray-500"
            />
          </div>
          
          {/* Error Display */}
          {result.error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">Error: {result.error}</p>
            </div>
          )}
          
          {/* Flags Helper */}
          <div className="mt-2 text-sm text-gray-500">
            {t('flagsDescription')}
          </div>

          {/* Pattern Explanation */}
          <RegexExplainer pattern={pattern} />
        </div>

        {/* Common Patterns */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('commonPatternsLabel')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {commonPatterns.map((patternData, idx) => (
              <button
                key={idx}
                onClick={() => loadPattern(patternData)}
                className="group p-3 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 rounded-xl text-left transition-all duration-200 shadow-sm hover:shadow-md"
                title={patternData.description}
              >
                <div className="font-medium text-green-800 text-sm group-hover:text-green-900">
                  {patternData.name}
                </div>
                <div className="text-xs text-green-600 mt-1 group-hover:text-green-700">
                  {patternData.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Test String */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('testStringLabel')}
          </label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder={t('testStringPlaceholder')}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('resultsLabel')}
            </label>
            {result.isValid && (
              <div className="text-sm text-gray-600">
                {isLoading ? (
                  <span className="inline-flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    {t('testingText')}
                  </span>
                ) : (
                  <span className="font-medium text-green-600">
                    {result.totalMatches} {t('matchesFoundText')}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 min-h-[100px] border">
            {!pattern || !testString ? (
              <p className="text-gray-500 text-center">
                {t('resultsPlaceholder')}
              </p>
            ) : result.error ? (
              <p className="text-red-600 text-center">
                {t('fixPatternText')}
              </p>
            ) : result.matches.length === 0 ? (
              <p className="text-gray-500 text-center">
                {t('noMatchesFoundText')}
              </p>
            ) : (
              <div className="space-y-4">
                {/* Highlighted Text */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{t('highlightedMatchesText')}</h4>
                  <div className="bg-white p-3 rounded border font-mono text-sm whitespace-pre-wrap">
                    {highlightMatches(testString, result.matches)}
                  </div>
                </div>

                {/* Match Details */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{t('matchDetailsText')}</h4>
                                    <div className="space-y-3 max-h-40 overflow-y-auto">
                    {result.matches.map((match, idx) => {
                      // 같은 색상 팔레트 사용
                      const colors = [
                        'from-blue-50 to-blue-100 border-blue-200',
                        'from-green-50 to-green-100 border-green-200',
                        'from-purple-50 to-purple-100 border-purple-200',
                        'from-orange-50 to-orange-100 border-orange-200',
                        'from-pink-50 to-pink-100 border-pink-200',
                        'from-teal-50 to-teal-100 border-teal-200',
                      ];
                      const colorClass = colors[idx % colors.length];
                      
                      return (
                        <div key={idx} className={`bg-gradient-to-r ${colorClass} p-4 rounded-lg border-2 text-sm shadow-sm`}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-gray-800 text-base">
                              {t('matchText')} {idx + 1}
                            </span>
                            <button
                              onClick={() => copyToClipboard(match.match)}
                              className="text-xs bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded-full border border-gray-600 hover:border-gray-700 transition-colors font-semibold shadow-sm hover:shadow-md"
                            >
                              {t('copyText')}
                            </button>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-white/60 p-2 rounded border">
                              <span className="font-semibold text-gray-700">{t('valueText')}</span>
                              <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">&quot;{match.match}&quot;</span>
                            </div>
                            <div className="bg-white/60 p-2 rounded border">
                              <span className="font-semibold text-gray-700">{t('positionText')}</span>
                              <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">{match.index}-{match.index + match.match.length}</span>
                            </div>
                            {match.groups.length > 0 && (
                              <div className="bg-white/60 p-2 rounded border">
                                <span className="font-semibold text-gray-700">{t('groupsText')}</span>
                                <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">[{match.groups.map(g => `"${g || ''}"`).join(', ')}]</span>
                              </div>
                            )}
                            {Object.keys(match.namedGroups).length > 0 && (
                              <div className="bg-white/60 p-2 rounded border">
                                <span className="font-semibold text-gray-700">{t('namedGroupsText')}</span>
                                <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">{JSON.stringify(match.namedGroups)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexTester; 