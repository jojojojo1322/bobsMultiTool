'use client';

interface RegexExplainerProps {
  pattern: string;
}

const RegexExplainer = ({ pattern }: RegexExplainerProps) => {
  const explainPattern = (pattern: string): string[] => {
    if (!pattern) return [];

    const explanations: string[] = [];
    
    // 간단한 패턴 설명 로직
    if (pattern.includes('^')) {
      explanations.push('🎯 Start of string anchor (^)');
    }
    if (pattern.includes('$')) {
      explanations.push('🎯 End of string anchor ($)');
    }
    if (pattern.includes('\\d')) {
      explanations.push('🔢 Matches any digit (0-9)');
    }
    if (pattern.includes('\\w')) {
      explanations.push('📝 Matches word characters (letters, digits, underscore)');
    }
    if (pattern.includes('\\s')) {
      explanations.push('⬜ Matches whitespace characters');
    }
    if (pattern.includes('+')) {
      explanations.push('➕ One or more of the preceding character');
    }
    if (pattern.includes('*')) {
      explanations.push('⭐ Zero or more of the preceding character');
    }
    if (pattern.includes('?')) {
      explanations.push('❓ Zero or one of the preceding character');
    }
    if (pattern.includes('.')) {
      explanations.push('🔵 Matches any single character (except newline)');
    }
    if (pattern.includes('[') && pattern.includes(']')) {
      explanations.push('📋 Character set - matches any character inside brackets');
    }
    if (pattern.includes('(') && pattern.includes(')')) {
      explanations.push('🎪 Grouping - creates a capture group');
    }
    if (pattern.includes('|')) {
      explanations.push('🔀 Alternation - matches either option');
    }
    if (pattern.includes('{') && pattern.includes('}')) {
      explanations.push('🔢 Quantifier - specific number of matches');
    }

    // 특별한 패턴들
    if (pattern.includes('@') && pattern.includes('\\.')) {
      explanations.push('📧 Email pattern detected');
    }
    if (pattern.includes('https?')) {
      explanations.push('🌐 URL pattern detected');
    }
    if (pattern.includes('\\d{3}') || pattern.includes('\\d{4}')) {
      explanations.push('📞 Phone number pattern detected');
    }

    return explanations;
  };

  const explanations = explainPattern(pattern);

  if (explanations.length === 0 || !pattern) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="text-sm font-medium text-blue-900 mb-2">🤖 Pattern Explanation</h4>
      <ul className="space-y-1">
        {explanations.map((explanation, idx) => (
          <li key={idx} className="text-sm text-blue-800">
            {explanation}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegexExplainer; 