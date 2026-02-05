import { MONTH_NAMES } from '../types';

export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (month: number, year: number) => {
  return new Date(year, month, 1).getDay();
};

export const getZodiacSign = (day: number, month: number): string => {
  // month is 0-11
  const days = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
  const signs = ["摩羯座", "水瓶座", "双鱼座", "白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座"];
  let sign = "";
  if (month === 0 && day <= 19) {
     sign = "摩羯座";
  } else if (day < days[month]) {
     sign = signs[month];
  } else {
     sign = signs[(month + 1) % 12];
  }
  return sign;
};

// Approximate year length in milliseconds (taking leap years into account)
const MS_PER_YEAR = 31557600000; 

export const calculatePreciseAge = (birthDate: Date): { years: number, decimalStr: string, totalSeconds: number, nextBirthdayDays: number } => {
  const now = new Date();
  const diff = now.getTime() - birthDate.getTime();
  
  const ageTotalYears = diff / MS_PER_YEAR;
  const years = Math.floor(ageTotalYears);
  
  // Get decimal part
  const decimalPart = ageTotalYears - years;
  // Format to 12 decimal places
  let decimalStr = decimalPart.toFixed(12).substring(2); // remove "0."

  // Total Seconds
  const totalSeconds = Math.floor(diff / 1000);

  // Next Birthday
  const currentYear = now.getFullYear();
  let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
  
  if (now > nextBirthday) {
    nextBirthday.setFullYear(currentYear + 1);
  }
  
  const diffTime = Math.abs(nextBirthday.getTime() - now.getTime());
  const nextBirthdayDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  return {
    years,
    decimalStr,
    totalSeconds,
    nextBirthdayDays
  };
};