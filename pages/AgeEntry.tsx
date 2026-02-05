import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateSelection, MONTH_ABBR } from '../types';
import { getDaysInMonth } from '../utils/dateUtils';
import { Icon } from '../components/Icon';
import { WheelSelector } from '../components/WheelSelector';

interface AgeEntryProps {
  setBirthDate: (date: Date) => void;
}

const AgeEntry: React.FC<AgeEntryProps> = ({ setBirthDate }) => {
  const navigate = useNavigate();
  
  // Default to ~25 years ago for better UX
  const [selection, setSelection] = useState<DateSelection>({
    day: 15,
    month: 5, // June
    year: 1998
  });

  const handleCalculate = () => {
    const date = new Date(selection.year, selection.month, selection.day);
    setBirthDate(date);
    navigate('/results');
  };

  // Wheel helpers
  const changeYear = (delta: number) => {
    setSelection(prev => ({ ...prev, year: prev.year + delta }));
  };
  const changeMonth = (delta: number) => {
    setSelection(prev => {
        let newMonth = prev.month + delta;
        let newYear = prev.year;
        if (newMonth > 11) { newMonth = 0; newYear++; }
        if (newMonth < 0) { newMonth = 11; newYear--; }
        return { ...prev, month: newMonth, year: newYear };
    });
  };
  const changeDay = (delta: number) => {
      setSelection(prev => {
          let newDay = prev.day + delta;
          const maxDays = getDaysInMonth(prev.month, prev.year);
          if (newDay > maxDays) newDay = 1;
          if (newDay < 1) newDay = maxDays;
          return { ...prev, day: newDay };
      });
  };

  const prevMonthIdx = selection.month === 0 ? 11 : selection.month - 1;
  const nextMonthIdx = selection.month === 11 ? 0 : selection.month + 1;
  
  const prevDayVal = selection.day === 1 ? getDaysInMonth(selection.month, selection.year) : selection.day - 1;
  const nextDayVal = selection.day === getDaysInMonth(selection.month, selection.year) ? 1 : selection.day + 1;

  return (
    <div className="flex-1 flex flex-col items-center px-6 bg-mesh w-full max-w-md mx-auto">
      {/* Headline */}
      <div className="pt-12 pb-8 w-full text-center">
        <h1 className="text-white tracking-tight text-[36px] font-bold leading-tight">
          岁月时钟
        </h1>
        <p className="text-white/50 text-sm mt-2 max-w-[280px] mx-auto">
          探索精确到小数点后 12 位的年龄
        </p>
      </div>

      <div className="flex-1 w-full flex flex-col justify-center">
        {/* Glassmorphism Picker Wrapper - Only Wheels now */}
        <div className="w-full p-8 glass-morphism rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          
          <div className="flex flex-col gap-4 mb-4 text-center">
            <span className="text-xs text-primary font-bold uppercase tracking-widest">选择出生日期</span>
          </div>

          {/* Wheel Selectors - Reordered to Year-Month-Day for Chinese context */}
          <div className="flex px-2 py-4 gap-4 items-center justify-center">
              <WheelSelector 
                  label="年" 
                  value={selection.year} 
                  prevValue={selection.year - 1} 
                  nextValue={selection.year + 1}
                  onPrev={() => changeYear(-1)}
                  onNext={() => changeYear(1)}
              />
              <WheelSelector 
                  label="月" 
                  value={MONTH_ABBR[selection.month]} 
                  prevValue={MONTH_ABBR[prevMonthIdx]} 
                  nextValue={MONTH_ABBR[nextMonthIdx]}
                  onPrev={() => changeMonth(-1)}
                  onNext={() => changeMonth(1)}
              />
              <WheelSelector 
                  label="日" 
                  value={selection.day} 
                  prevValue={prevDayVal} 
                  nextValue={nextDayVal}
                  onPrev={() => changeDay(-1)}
                  onNext={() => changeDay(1)}
              />
          </div>
        </div>

        {/* Preciseness Indicator */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[10px] text-white/60 font-medium tracking-[0.2em] uppercase">实时精度已启用</span>
          </div>
          <p className="text-white/30 text-[9px] text-center italic mt-1 px-8">
              * 年龄计算采用原子钟同步以确保最大精确度
          </p>
        </div>
      </div>

      {/* Footer Action */}
      <div className="w-full pb-8 pt-8">
        <div className="relative group cursor-pointer" onClick={handleCalculate}>
            <div className="absolute inset-0 bg-primary blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
            <button className="relative w-full glow-button bg-primary text-white h-16 rounded-full flex items-center justify-center gap-3 overflow-hidden transition-transform active:scale-95">
                <span className="text-lg font-bold tracking-tight">开始计算</span>
                <Icon name="speed" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AgeEntry;