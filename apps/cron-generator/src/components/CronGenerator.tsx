'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { CronField, CronResult } from '@/types';
// cron-parser 라이브러리 제거하고 직접 구현

const CronGenerator = () => {
  const { t, language } = useTranslation();
  const [cronExpression, setCronExpression] = useState('0 9 * * 1-5');
  const [inputValue, setInputValue] = useState('0 9 * * 1-5');
  const [isValidating, setIsValidating] = useState(false);
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
  const validateCronExpression = useCallback((expression: string): CronResult => {
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
  }, []);

  // 크론 표현식 설명 생성 (기본 요약)
  const generateCronDescription = (parts: string[]): string => {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    return generateSummaryDescription(minute, hour, dayOfMonth, month, dayOfWeek);
  };

  // 구조화된 설명 생성 (표시용)
  const generateStructuredDescription = (parts: string[]): { 
    time: string; 
    dayOfMonth: string; 
    month: string; 
    dayOfWeek: string; 
    summary: string;
  } => {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    
    const timeDesc = generateTimeDescription(minute, hour);
    const dayOfMonthDesc = generateDayOfMonthDescription(dayOfMonth);
    const monthDesc = generateMonthDescription(month);
    const dayOfWeekDesc = generateDayOfWeekDescription(dayOfWeek);
    const summaryDesc = generateSummaryDescription(minute, hour, dayOfMonth, month, dayOfWeek);
    
    return {
      time: timeDesc,
      dayOfMonth: dayOfMonthDesc,
      month: monthDesc,
      dayOfWeek: dayOfWeekDesc,
      summary: summaryDesc
    };
  };

  // 시간 설명 생성
  const generateTimeDescription = (minute: string, hour: string): string => {
    if (minute === '*' && hour === '*') {
      return '매분';
    }
    
    if (minute === '0' && hour === '*') {
      return '매시간 정각 (00분)';
    }
    
    if (minute !== '*' && hour !== '*') {
      if (minute.startsWith('*/')) {
        const interval = minute.substring(2);
        return `${hour.padStart(2, '0')}시에 ${interval}분 간격`;
      } else if (minute.includes(',')) {
        const minutes = minute.split(',').join(', ');
        return `${hour.padStart(2, '0')}시 ${minutes}분`;
      } else {
        return `${hour.padStart(2, '0')}시 ${minute.padStart(2, '0')}분`;
      }
    }
    
    if (minute !== '*' && hour === '*') {
      if (minute.startsWith('*/')) {
        const interval = minute.substring(2);
        return `매시간 ${interval}분 간격`;
      } else if (minute.includes(',')) {
        const minutes = minute.split(',').join(', ');
        return `매시간 ${minutes}분`;
      } else {
        return `매시간 ${minute}분`;
      }
    }
    
    if (minute === '*' && hour !== '*') {
      if (hour.includes(',')) {
        const hours = hour.split(',').join(', ');
        return `${hours}시대 매분`;
      } else if (hour.includes('-')) {
        const [start, end] = hour.split('-');
        return `${start}시~${end}시 매분`;
      } else {
        return `${hour}시대 매분`;
      }
    }
    
    return '매분';
  };

  // 월 내 일 설명
  const generateDayOfMonthDescription = (dayOfMonth: string): string => {
    if (dayOfMonth === '*') return '매일';
    
    if (dayOfMonth.includes(',')) {
      const days = dayOfMonth.split(',').join(', ');
      return `${days}일`;
    } else if (dayOfMonth.includes('-')) {
      const [start, end] = dayOfMonth.split('-');
      return `${start}일~${end}일`;
    } else if (dayOfMonth.startsWith('*/')) {
      const interval = dayOfMonth.substring(2);
      return `${interval}일 간격`;
    } else {
      return `${dayOfMonth}일`;
    }
  };

  // 월 설명
  const generateMonthDescription = (month: string): string => {
    if (month === '*') return '매월';
    
    const monthNames = ['', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    
    if (month.includes(',')) {
      const months = month.split(',').map(m => monthNames[parseInt(m)]).join(', ');
      return months;
    } else if (month.includes('-')) {
      const [start, end] = month.split('-');
      return `${monthNames[parseInt(start)]}~${monthNames[parseInt(end)]}`;
    } else {
      return monthNames[parseInt(month)];
    }
  };

  // 요일 설명
  const generateDayOfWeekDescription = (dayOfWeek: string): string => {
    if (dayOfWeek === '*') return '매일';
    
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    
    if (dayOfWeek === '1-5') return '평일';
    if (dayOfWeek === '0,6') return '주말';
    
    if (dayOfWeek.includes(',')) {
      const days = dayOfWeek.split(',').map(d => dayNames[parseInt(d)]).join(', ');
      return days;
    } else if (dayOfWeek.includes('-')) {
      const [start, end] = dayOfWeek.split('-');
      return `${dayNames[parseInt(start)]}~${dayNames[parseInt(end)]}`;
    } else {
      return dayNames[parseInt(dayOfWeek)];
    }
  };

  // 요약 설명 생성
  const generateSummaryDescription = (minute: string, hour: string, dayOfMonth: string, month: string, dayOfWeek: string): string => {
    // 자주 사용되는 패턴들에 대한 특별한 요약
    if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return '매분마다 실행';
    }
    if (minute === '0' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return '매시간 정각에 실행';
    }
    if (minute === '0' && hour === '0' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return '매일 자정에 실행';
    }
    if (minute === '0' && hour !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '1-5') {
      return `평일 ${hour.padStart(2, '0')}시에 실행`;
    }
    if (minute === '0' && hour === '0' && dayOfMonth === '*' && month === '*' && dayOfWeek === '0') {
      return '매주 일요일 자정에 실행';
    }
    if (minute === '0' && hour === '0' && dayOfMonth === '1' && month === '*' && dayOfWeek === '*') {
      return '매월 1일 자정에 실행';
    }
    
    return '위 조건에 따라 실행';
  };

  // 다음 실행 시간들 계산 (정확한 크론 파싱)
  const getNextExecutions = (parts: string[]): Date[] => {
    const executions: Date[] = [];
    
    try {
      const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
      const now = new Date();
      // 다음 분부터 시작하여 과거 시간 방지
      let currentTime = new Date(now.getTime() + 60000);
      currentTime.setSeconds(0);
      currentTime.setMilliseconds(0);
      
      // 다음 5개 실행 시간 찾기
      for (let count = 0; count < 5; count++) {
        const nextTime = findNextExecution(currentTime, { minute, hour, dayOfMonth, month, dayOfWeek });
        if (nextTime) {
          executions.push(new Date(nextTime));
          currentTime = new Date(nextTime.getTime() + 60000); // 1분 추가해서 다음 실행시간 찾기
        }
      }
      
      return executions;
    } catch (error) {
      console.error('Error parsing cron expression:', error);
      return [];
    }
  };

  // 크론 표현식에 따른 다음 실행 시간 찾기
  const findNextExecution = (
    from: Date, 
    cronParts: { minute: string; hour: string; dayOfMonth: string; month: string; dayOfWeek: string }
  ): Date | null => {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = cronParts;
    
    // 현재 시간부터 최대 2년 후까지 검색
    const maxIterations = 365 * 24 * 60 * 2; // 2년
    let currentDate = new Date(from);
    
    for (let i = 0; i < maxIterations; i++) {
      // 분 체크
      if (!matchesCronField(currentDate.getMinutes(), minute)) {
        currentDate.setMinutes(currentDate.getMinutes() + 1);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
        continue;
      }
      
      // 시 체크
      if (!matchesCronField(currentDate.getHours(), hour)) {
        currentDate.setHours(currentDate.getHours() + 1);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
        continue;
      }
      
      // 월 체크 (1-12)
      if (!matchesCronField(currentDate.getMonth() + 1, month)) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate.setDate(1);
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
        continue;
      }
      
      // 일 체크
      if (!matchesCronField(currentDate.getDate(), dayOfMonth)) {
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
        continue;
      }
      
      // 요일 체크 (0-6, 일요일=0)
      if (!matchesCronField(currentDate.getDay(), dayOfWeek)) {
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
        continue;
      }
      
      // 모든 조건이 맞으면 반환
      return currentDate;
    }
    
    return null;
  };

  // 크론 필드가 현재 값과 매치되는지 확인
  const matchesCronField = (value: number, cronField: string): boolean => {
    if (cronField === '*') return true;
    
    // 범위 (예: 1-5)
    if (cronField.includes('-')) {
      const [start, end] = cronField.split('-').map(Number);
      return value >= start && value <= end;
    }
    
    // 리스트 (예: 1,3,5)
    if (cronField.includes(',')) {
      const values = cronField.split(',').map(Number);
      return values.includes(value);
    }
    
    // 간격 (예: */5)
    if (cronField.startsWith('*/')) {
      const interval = parseInt(cronField.substring(2));
      return value % interval === 0;
    }
    
    // 정확한 값
    return value === parseInt(cronField);
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

  // 입력값 디바운스 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsValidating(true);
      const validationResult = validateCronExpression(inputValue);
      setResult(validationResult);
      setCronExpression(inputValue);
      setIsValidating(false);
    }, 300); // 300ms 디바운스

    return () => clearTimeout(timer);
  }, [inputValue, validateCronExpression]);

  // 초기 로드시 검증
  useEffect(() => {
    const validationResult = validateCronExpression(cronExpression);
    setResult(validationResult);
  }, []);

  // 필드 변경 처리
  const handleFieldChange = (field: keyof CronField, value: string) => {
    const newFields = { ...cronFields, [field]: value };
    setCronFields(newFields);
    
    const newExpression = generateExpressionFromFields(newFields);
    setInputValue(newExpression);
    setCronExpression(newExpression);
  };

  // 패턴 선택 처리
  const handlePatternSelect = (expression: string) => {
    setInputValue(expression);
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

  // 복사 상태
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 복사 기능
  const copyToClipboard = async () => {
    if (!result.isValid) return;
    
    try {
      await navigator.clipboard.writeText(cronExpression);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
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
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('cronExpressionPlaceholder')}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900 bg-white placeholder-gray-500 font-mono text-lg ${
                  isValidating
                    ? 'border-yellow-400 focus:border-yellow-500'
                    : result.isValid
                    ? 'border-green-400 focus:border-green-500'
                    : 'border-red-400 focus:border-red-500'
                }`}
              />
              {isValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-yellow-400 border-t-transparent"></div>
                </div>
              )}
            </div>
            <button
              onClick={copyToClipboard}
              disabled={!result.isValid || isValidating}
              className={`px-6 py-3 text-white font-semibold rounded-lg focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed ${
                copyStatus === 'success'
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                  : copyStatus === 'error'
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : !result.isValid || isValidating
                  ? 'bg-gray-400 disabled:hover:bg-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              {copyStatus === 'success' ? (
                <span className="flex items-center gap-2">
                  <span>✓</span> 복사됨
                </span>
              ) : copyStatus === 'error' ? (
                <span className="flex items-center gap-2">
                  <span>✗</span> 실패
                </span>
              ) : (
                '복사'
              )}
            </button>
          </div>
          
          {/* 검증 결과 */}
          <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            isValidating 
              ? 'bg-yellow-50 text-yellow-800 border-yellow-200' 
              : result.isValid 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {isValidating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-400 border-t-transparent"></div>
                <span className="font-semibold">검증 중...</span>
              </div>
            ) : result.isValid ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-600 text-lg">✓</span>
                  <span className="font-semibold text-green-800">올바른 크론 표현식입니다</span>
                </div>
                <div className="bg-white p-4 rounded border border-green-200 space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">📋</span>
                    <h3 className="text-lg font-medium text-gray-900">실행 규칙</h3>
                  </div>
                  
                  {(() => {
                    const parts = result.expression.split(/\s+/);
                    const structured = generateStructuredDescription(parts);
                    
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 font-medium">⏰ 시간:</span>
                          <span className="text-gray-700">{structured.time}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-purple-600 font-medium">📅 날짜:</span>
                          <span className="text-gray-700">{structured.dayOfMonth}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 font-medium">🗓️ 월:</span>
                          <span className="text-gray-700">{structured.month}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-orange-600 font-medium">📆 요일:</span>
                          <span className="text-gray-700">{structured.dayOfWeek}</span>
                        </div>
                      </div>
                    );
                  })()}
                  
                  <div className="mt-4 pt-3 border-t border-green-100">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-medium">📝 요약:</span>
                      <span className="text-green-700 font-medium">{result.description}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-600 text-lg">✗</span>
                  <span className="font-semibold text-red-800">잘못된 크론 표현식입니다</span>
                </div>
                {result.error && (
                  <div className="bg-white p-3 rounded border border-red-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">오류 내용:</p>
                    <p className="text-red-700 text-sm">{result.error}</p>
                    <p className="text-gray-600 text-xs mt-2">
                      💡 크론 표현식은 5개 필드로 구성됩니다: 분 시 일 월 요일
                    </p>
                  </div>
                )}
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