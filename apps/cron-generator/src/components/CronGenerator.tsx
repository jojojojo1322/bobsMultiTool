'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { CronField, CronResult } from '@/types';

const CronGenerator = () => {
  const { t, language } = useTranslation();
  const [cronExpression, setCronExpression] = useState('0 9 * * 1-5');
  const [cronFields, setCronFields] = useState<CronField>({
    minute: '0',
    hour: '9',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '1-5',
  });
  const [result, setResult] = useState<CronResult>({
    isValid: true,
    expression: '0 9 * * 1-5',
    description: '',
    nextExecutions: [],
  });

  // 일반적인 크론 패턴들
  const commonPatterns = [
    { name: t('pattern1Name'), expression: '* * * * *', description: t('pattern1Desc') },
    { name: t('pattern2Name'), expression: '0 * * * *', description: t('pattern2Desc') },
    { name: t('pattern3Name'), expression: '0 0 * * *', description: t('pattern3Desc') },
    { name: t('pattern4Name'), expression: '0 9 * * *', description: t('pattern4Desc') },
    { name: t('pattern5Name'), expression: '0 9 * * 1-5', description: t('pattern5Desc') },
    { name: t('pattern6Name'), expression: '0 0 * * 0', description: t('pattern6Desc') },
    { name: t('pattern7Name'), expression: '0 0 1 * *', description: t('pattern7Desc') },
    { name: t('pattern8Name'), expression: '*/15 * * * *', description: t('pattern8Desc') },
  ];

  // 크론 표현식 검증 함수
  const validateCronExpression = (expression: string): CronResult => {
    try {
      const parts = expression.trim().split(/\s+/);
      
      if (parts.length !== 5 && parts.length !== 6) {
        return {
          isValid: false,
          expression,
          description: '',
          nextExecutions: [],
          error: 'Cron expression must have 5 or 6 fields',
        };
      }

      // 기본적인 크론 표현식 설명 생성
      const description = generateCronDescription(parts);
      const nextExecutions = getNextExecutions(parts);

      return {
        isValid: true,
        expression,
        description,
        nextExecutions,
      };
    } catch (error) {
      return {
        isValid: false,
        expression,
        description: '',
        nextExecutions: [],
        error: error instanceof Error ? error.message : 'Invalid cron expression',
      };
    }
  };

  // 크론 표현식 설명 생성
  const generateCronDescription = (parts: string[]): string => {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    
    // 간단한 패턴 매칭
    if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return 'Every minute';
    }
    if (minute === '0' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return 'Every hour';
    }
    if (minute === '0' && hour === '0' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return 'Every day at midnight';
    }
    if (minute === '0' && hour === '9' && dayOfMonth === '*' && month === '*' && dayOfWeek === '1-5') {
      return 'Every weekday at 9:00 AM';
    }
    if (minute === '0' && hour === '0' && dayOfMonth === '*' && month === '*' && dayOfWeek === '0') {
      return 'Every Sunday at midnight';
    }
    if (minute === '0' && hour === '0' && dayOfMonth === '1' && month === '*' && dayOfWeek === '*') {
      return 'First day of every month at midnight';
    }
    if (minute.startsWith('*/')) {
      const interval = minute.substring(2);
      return `Every ${interval} minutes`;
    }
    
    // 일반적인 설명
    let desc = 'At ';
    if (minute !== '*') desc += minute.padStart(2, '0');
    else desc += 'every minute';
    
    if (hour !== '*') {
      desc += `:${hour.padStart(2, '0')}`;
    } else if (minute !== '*') {
      desc += ' of every hour';
    }
    
    if (dayOfMonth !== '*') {
      desc += ` on day ${dayOfMonth} of the month`;
    } else if (dayOfWeek !== '*') {
      if (dayOfWeek === '1-5') desc += ' on weekdays';
      else if (dayOfWeek === '0,6') desc += ' on weekends';
      else desc += ` on day ${dayOfWeek} of the week`;
    }
    
    return desc;
  };

  // 다음 실행 시간들 계산 (간단한 구현)
  const getNextExecutions = (parts: string[]): Date[] => {
    const executions: Date[] = [];
    const now = new Date();
    
    // 간단한 계산 - 실제로는 더 정교한 크론 파서가 필요
    for (let i = 0; i < 5; i++) {
      const nextTime = new Date(now);
      nextTime.setMinutes(nextTime.getMinutes() + i * 60); // 임시 계산
      executions.push(nextTime);
    }
    
    return executions;
  };

  // 다국어 날짜 포맷팅
  const formatDateTime = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    // 언어별 로케일 설정
    const localeMap: Record<string, string> = {
      'en': 'en-US',
      'ko': 'ko-KR',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'vi': 'vi-VN'
    };

    const locale = localeMap[language] || 'en-US';
    
    try {
      return new Intl.DateTimeFormat(locale, options).format(date);
    } catch (error) {
      // 폴백: 기본 형식으로 표시
      return date.toLocaleString();
    }
  };

  // 크론 필드에서 표현식 생성
  const generateExpressionFromFields = (fields: CronField): string => {
    return `${fields.minute} ${fields.hour} ${fields.dayOfMonth} ${fields.month} ${fields.dayOfWeek}`;
  };

  // 표현식 변경 처리
  useEffect(() => {
    const validationResult = validateCronExpression(cronExpression);
    setResult(validationResult);
  }, [cronExpression]);

  // 필드 변경 처리
  const handleFieldChange = (field: keyof CronField, value: string) => {
    const newFields = { ...cronFields, [field]: value };
    setCronFields(newFields);
    
    const newExpression = generateExpressionFromFields(newFields);
    setCronExpression(newExpression);
  };

  // 패턴 선택 처리
  const handlePatternSelect = (expression: string) => {
    setCronExpression(expression);
    
    // 표현식에서 필드 추출
    const parts = expression.split(/\s+/);
    if (parts.length >= 5) {
      setCronFields({
        minute: parts[0],
        hour: parts[1],
        dayOfMonth: parts[2],
        month: parts[3],
        dayOfWeek: parts[4],
      });
    }
  };

  // 복사 기능
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cronExpression);
      // TODO: 성공 토스트 표시
    } catch (err) {
      console.error('Copy failed:', err);
      // TODO: 실패 토스트 표시
    }
  };

  return (
    <div className="space-y-8">
      {/* 크론 표현식 입력 */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t('cronExpressionLabel')}
        </h2>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              placeholder={t('cronExpressionPlaceholder')}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white placeholder-gray-500 font-mono text-lg"
            />
            <button
              onClick={copyToClipboard}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {t('copyText')}
            </button>
          </div>
          
          {/* 검증 결과 */}
          <div className={`p-4 rounded-lg border-2 ${result.isValid ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {result.isValid ? (
              <div>
                <span className="font-semibold">✓ {t('validExpression')}</span>
                <p className="mt-1 text-green-700">{result.description}</p>
              </div>
            ) : (
              <div>
                <span className="font-semibold">✗ {t('invalidExpression')}</span>
                {result.error && <p className="mt-1 text-red-700">{result.error}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 시각적 크론 생성기 */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t('generatorTitle')}
        </h2>
        
        <div className="grid md:grid-cols-5 gap-4">
          {/* 분 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('minuteLabel')}
            </label>
            <select
              value={cronFields.minute}
              onChange={(e) => handleFieldChange('minute', e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
            >
              <option value="*">{t('everyMinute')}</option>
              <option value="0">0</option>
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
              <option value="*/5">Every 5 min</option>
              <option value="*/10">Every 10 min</option>
              <option value="*/15">Every 15 min</option>
              <option value="*/30">Every 30 min</option>
            </select>
          </div>

          {/* 시 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('hourLabel')}
            </label>
            <select
              value={cronFields.hour}
              onChange={(e) => handleFieldChange('hour', e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
            >
              <option value="*">{t('everyHour')}</option>
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
              ))}
            </select>
          </div>

          {/* 일 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('dayOfMonthLabel')}
            </label>
            <select
              value={cronFields.dayOfMonth}
              onChange={(e) => handleFieldChange('dayOfMonth', e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
            >
              <option value="*">{t('everyDay')}</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          {/* 월 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('monthLabel')}
            </label>
            <select
              value={cronFields.month}
              onChange={(e) => handleFieldChange('month', e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
            >
              <option value="*">{t('everyMonth')}</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>

          {/* 요일 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('dayOfWeekLabel')}
            </label>
            <select
              value={cronFields.dayOfWeek}
              onChange={(e) => handleFieldChange('dayOfWeek', e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
            >
              <option value="*">{t('everyDay')}</option>
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
              <option value="1-5">Weekdays</option>
              <option value="0,6">Weekends</option>
            </select>
          </div>
        </div>
      </div>

      {/* 다음 실행 시간 */}
      {result.isValid && result.nextExecutions.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('nextExecutionsLabel')}
          </h2>
          
          <div className="space-y-3">
            {result.nextExecutions.slice(0, 5).map((date, index) => (
              <div key={index} className="flex items-center text-gray-800 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-blue-600 w-8">{index + 1}.</span>
                <span className="font-mono text-lg">{formatDateTime(date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 일반적인 패턴들 */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t('commonPatternsTitle')}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {commonPatterns.map((pattern, index) => (
            <div
              key={index}
              onClick={() => handlePatternSelect(pattern.expression)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all duration-200 hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{pattern.name}</h3>
                <code className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded font-mono border border-blue-200 hover:bg-blue-200 transition-colors">
                  {pattern.expression}
                </code>
              </div>
              <p className="text-sm text-gray-600">{pattern.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CronGenerator; 