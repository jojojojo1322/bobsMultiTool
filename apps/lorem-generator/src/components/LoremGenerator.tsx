'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { translations } from '@/locales';
import { Language, LoremType, LoremOptions } from '@/types';
import LanguageSelector from './LanguageSelector';

export default function LoremGenerator() {
  const { t, language } = useTranslation();
  const [options, setOptions] = useState<LoremOptions>({
    language: language,
    type: 'paragraphs',
    count: 3,
  });
  const [generatedText, setGeneratedText] = useState<string>('');
  const [copyMessage, setCopyMessage] = useState<string>('');

  const generateLorem = () => {
    const samples = translations[options.language].loremSample;
    const words = samples.flatMap(sentence => sentence.split(' '));
    const sentences = samples;
    
    let result = '';
    
    if (options.type === 'words') {
      const selectedWords = [];
      for (let i = 0; i < options.count; i++) {
        selectedWords.push(words[i % words.length]);
      }
      result = selectedWords.join(' ');
    } else if (options.type === 'sentences') {
      const selectedSentences = [];
      for (let i = 0; i < options.count; i++) {
        selectedSentences.push(sentences[i % sentences.length]);
      }
      result = selectedSentences.join(' ');
    } else { // paragraphs
      const paragraphs = [];
      for (let p = 0; p < options.count; p++) {
        const sentencesInParagraph = Math.floor(Math.random() * 3) + 3; // 3-5 sentences per paragraph
        const paragraphSentences = [];
        for (let s = 0; s < sentencesInParagraph; s++) {
          paragraphSentences.push(sentences[(p * sentencesInParagraph + s) % sentences.length]);
        }
        paragraphs.push(paragraphSentences.join(' '));
      }
      result = paragraphs.join('\n\n');
    }
    
    setGeneratedText(result);
  };

  const copyToClipboard = async () => {
    if (!generatedText) return;
    
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopyMessage(t('copySuccess'));
      setTimeout(() => setCopyMessage(''), 2000);
    } catch (err) {
      setCopyMessage(t('copyFailed'));
      setTimeout(() => setCopyMessage(''), 2000);
    }
  };

  // Update options when language changes
  useEffect(() => {
    setOptions(prev => ({ ...prev, language }));
  }, [language]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Language Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('languageLabel')}
            </label>
            <div className="w-full">
              <LanguageSelector />
            </div>
          </div>

          {/* Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('typeLabel')}
            </label>
            <select
              value={options.type}
              onChange={(e) => setOptions(prev => ({ ...prev, type: e.target.value as LoremType }))}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 h-10 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="words">{t('type.words')}</option>
              <option value="sentences">{t('type.sentences')}</option>
              <option value="paragraphs">{t('type.paragraphs')}</option>
            </select>
          </div>

          {/* Count Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('countLabel')}
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={options.count}
              onChange={(e) => setOptions(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
              className="w-full px-4 py-2 h-10 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Generate Button */}
          <div>
            <button
              onClick={generateLorem}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium py-2 px-6 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {t('generateButton')}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Text */}
      {generatedText && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('generatedText')}</h3>
            <div className="flex items-center space-x-3">
              {copyMessage && (
                <span className={`text-sm ${copyMessage.includes('성공') || copyMessage.includes('Copied') || copyMessage.includes('복사') ? 'text-green-600' : 'text-red-600'}`}>
                  {copyMessage}
                </span>
              )}
              <button
                onClick={copyToClipboard}
                className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{t('copyButton')}</span>
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed font-sans">
              {generatedText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
} 