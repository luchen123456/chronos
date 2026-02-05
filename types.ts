export interface DateSelection {
  day: number;
  month: number; // 0-11
  year: number;
}

export interface AgeStats {
  years: number;
  decimal: string; // The decimal part as a string for formatting
  zodiac: string;
  nextBirthdayDays: number;
  totalSeconds: number;
  totalDays: number;
}

export enum ViewState {
  ENTRY = 'ENTRY',
  RESULTS = 'RESULTS',
}

export const MONTH_NAMES = [
  "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月"
];

export const MONTH_ABBR = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月"
];