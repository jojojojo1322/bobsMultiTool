export interface CronField {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  year?: string;
}

export interface CronResult {
  isValid: boolean;
  expression: string;
  description: string;
  nextExecutions: Date[];
  error?: string;
}

export interface CronPattern {
  name: string;
  expression: string;
  description: string;
}

export type CronFieldType = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek' | 'year'; 