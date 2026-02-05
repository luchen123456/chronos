import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculatePreciseAge, getZodiacSign } from '../utils/dateUtils';
import { Icon } from '../components/Icon';

interface PreciseResultsProps {
  birthDate: Date;
}

const PreciseResults: React.FC<PreciseResultsProps> = ({ birthDate }) => {
  const navigate = useNavigate();
  
  // Static stats that don't change every frame
  const [staticStats, setStaticStats] = useState({
    zodiac: "",
    nextBirthdayDays: 0,
    lifeProgress: 0,
    totalSeconds: 0
  });

  // Refs for high-frequency updates to avoid React render cycle overhead (solving "slow/lag")
  const yearsRef = useRef<HTMLHeadingElement>(null);
  const p1Ref = useRef<HTMLSpanElement>(null);
  const p2Ref = useRef<HTMLSpanElement>(null);
  const p3Ref = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const frameRef = useRef<number>();

  useEffect(() => {
    // Initial static calculation
    const zodiac = getZodiacSign(birthDate.getDate(), birthDate.getMonth());
    
    const update = () => {
        const { years, decimalStr, totalSeconds, nextBirthdayDays } = calculatePreciseAge(birthDate);
        
        // Update DOM directly for numbers (Solving "Jumping" and "Slow")
        if (yearsRef.current) yearsRef.current.innerText = years.toString();
        // We have 12 decimals now (3 groups of 4)
        if (p1Ref.current) p1Ref.current.innerText = decimalStr.substring(0, 4);
        if (p2Ref.current) p2Ref.current.innerText = decimalStr.substring(4, 8);
        if (p3Ref.current) p3Ref.current.innerText = decimalStr.substring(8, 12);

        // Calculate progress for bar
        const lifeExpectancySeconds = 80 * 365.25 * 24 * 60 * 60; 
        const progress = Math.min(100, Math.max(0, (totalSeconds / lifeExpectancySeconds) * 100));
        
        if (progressRef.current) {
            progressRef.current.style.width = `${progress}%`;
        }

        setStaticStats(prev => {
            if (prev.totalSeconds !== totalSeconds || prev.nextBirthdayDays !== nextBirthdayDays) {
                return {
                    zodiac,
                    nextBirthdayDays,
                    totalSeconds,
                    lifeProgress: progress
                };
            }
            return prev;
        });

        frameRef.current = requestAnimationFrame(update);
    };

    frameRef.current = requestAnimationFrame(update);

    return () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [birthDate]);

  const copyToClipboard = () => {
    if (yearsRef.current && p1Ref.current) {
        const text = `${yearsRef.current.innerText}.${p1Ref.current.innerText}${p2Ref.current?.innerText}${p3Ref.current?.innerText}`;
        navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background-dark max-w-md mx-auto min-h-screen">
      
      {/* Top Bar */}
      <div className="flex items-center p-4 pb-2 justify-between z-10">
        <button 
            onClick={() => navigate('/')}
            className="text-white flex size-12 shrink-0 items-center justify-start cursor-pointer hover:opacity-70 transition-opacity"
        >
          <Icon name="arrow_back_ios" />
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            精确结果
        </h2>
        <div className="flex w-12 items-center justify-end">
            <button className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                <Icon name="share" />
            </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto w-full">
        
        {/* Main Age Big Number */}
        <div className="text-center mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Added font-mono to prevent jumping */}
            <h1 ref={yearsRef} className="text-white tracking-tight text-[120px] font-bold leading-none font-mono">
                0
            </h1>
        </div>

        {/* Decimals */}
        <div className="flex flex-col items-center gap-2 max-w-full overflow-hidden w-full">
            {/* Added font-mono to prevent jumping */}
            <div className="flex flex-wrap justify-center items-baseline px-4 text-center leading-none tracking-tight gap-x-1 sm:gap-x-2 font-mono">
                <span className="text-white text-5xl font-bold">.</span>
                <span ref={p1Ref} className="text-white text-4xl sm:text-5xl font-semibold w-[4ch] text-left">0000</span>
                <span ref={p2Ref} className="text-white/80 text-3xl sm:text-4xl font-semibold w-[4ch] text-left">0000</span>
                <span ref={p3Ref} className="text-white/60 text-2xl sm:text-3xl font-medium w-[4ch] text-left">0000</span>
            </div>
        </div>

        {/* Copy Button */}
        <div className="flex px-4 py-12 justify-center w-full">
            <button 
                onClick={copyToClipboard}
                className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-primary text-white gap-2 neon-glow hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(19,91,236,0.3)]"
            >
                <Icon name="content_copy" className="text-[20px]" />
                <span className="truncate font-bold text-sm">复制精确年龄</span>
            </button>
        </div>

        {/* Live Statistics Section */}
        <div className="w-full">
            <h3 className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] px-4 pb-4">实时统计</h3>
        </div>

        {/* Scrollable Cards */}
        <div className="w-full flex gap-4 overflow-x-auto px-4 pb-12 hide-scrollbar snap-x">
            <div className="min-w-[160px] bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 snap-start hover:bg-white/10 transition-colors">
                <Icon name="stars" className="text-accent text-[28px]" />
                <div>
                    <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider">星座</p>
                    <p className="text-white text-xl font-bold">{staticStats.zodiac}</p>
                </div>
            </div>

            <div className="min-w-[160px] bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 snap-start hover:bg-white/10 transition-colors">
                <Icon name="cake" className="text-primary text-[28px]" />
                <div>
                    <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider">下次生日</p>
                    {/* Updated text format */}
                    <p className="text-white text-xl font-bold tabular-nums">{staticStats.nextBirthdayDays} 天后</p>
                </div>
            </div>

            <div className="min-w-[160px] bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 snap-start hover:bg-white/10 transition-colors">
                <Icon name="timer" className="text-green-400 text-[28px]" />
                <div>
                    <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider">生存秒数</p>
                    <p className="text-white text-xl font-bold tabular-nums">
                        {(staticStats.totalSeconds / 1000000).toFixed(1)}M+
                    </p>
                </div>
            </div>

            <div className="min-w-[160px] bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 snap-start hover:bg-white/10 transition-colors">
                <Icon name="hourglass_top" className="text-yellow-400 text-[28px]" />
                <div>
                    <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider">生命进度</p>
                    <p className="text-white text-xl font-bold tabular-nums">{staticStats.lifeProgress.toFixed(1)}%</p>
                </div>
            </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="h-1.5 w-full bg-white/5 relative mt-auto">
        <div 
            ref={progressRef}
            className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_rgba(19,91,236,0.6)]" 
            style={{ width: '0%' }}
        />
      </div>
    </div>
  );
};

export default PreciseResults;