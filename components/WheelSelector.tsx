import React, { useEffect, useRef } from 'react';

interface WheelSelectorProps {
  label: string;
  value: string | number;
  prevValue: string | number;
  nextValue: string | number;
  onPrev: () => void;
  onNext: () => void;
}

export const WheelSelector: React.FC<WheelSelectorProps> = ({ label, value, prevValue, nextValue, onPrev, onNext }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAccumulator = useRef(0);
  const touchStartY = useRef<number | null>(null);

  // Store handlers in ref to avoid re-binding event listeners on every render
  const handlersRef = useRef({ onPrev, onNext });
  useEffect(() => {
    handlersRef.current = { onPrev, onNext };
  }, [onPrev, onNext]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollAccumulator.current += e.deltaY;
      
      const threshold = 20; // Sensitivity threshold for wheel
      if (scrollAccumulator.current > threshold) {
        handlersRef.current.onNext();
        scrollAccumulator.current = 0;
      } else if (scrollAccumulator.current < -threshold) {
        handlersRef.current.onPrev();
        scrollAccumulator.current = 0;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      scrollAccumulator.current = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      e.preventDefault(); // Prevent browser scroll
      
      const currentY = e.touches[0].clientY;
      const diff = touchStartY.current - currentY; // positive = swipe up = scroll down content
      
      // Sensitivity for touch
      const threshold = 15; 
      
      if (diff > threshold) {
        handlersRef.current.onNext();
        touchStartY.current = currentY; // Reset anchor to allow continuous scrolling
      } else if (diff < -threshold) {
        handlersRef.current.onPrev();
        touchStartY.current = currentY;
      }
    };

    // Use passive: false to allow preventDefault()
    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="text-[10px] text-white/30 text-center mb-2 font-bold uppercase tracking-wider">{label}</div>
      <div 
        ref={containerRef}
        className="bg-white/5 border border-white/5 rounded-2xl w-full flex flex-col items-center select-none cursor-grab active:cursor-grabbing overflow-hidden relative h-[140px] justify-center touch-none transition-colors hover:bg-white/10"
      >
        {/* Gradients for depth effect */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#101622] to-transparent pointer-events-none z-10 opacity-80"></div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#101622] to-transparent pointer-events-none z-10 opacity-80"></div>
        
        {/* Selection Indicator Line (Optional visual aid) */}
        <div className="absolute top-1/2 left-2 right-2 h-8 -mt-4 bg-white/5 rounded-lg border border-white/5 pointer-events-none z-0"></div>

        <div 
            onClick={onPrev}
            className="text-white/20 text-sm font-medium py-3 w-full text-center hover:text-white/40 transition-colors cursor-pointer z-10"
        >
          {prevValue}
        </div>
        
        <div className="text-white text-2xl font-bold py-3 w-full text-center scale-110 z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
          {value}
        </div>
        
        <div 
            onClick={onNext}
            className="text-white/20 text-sm font-medium py-3 w-full text-center hover:text-white/40 transition-colors cursor-pointer z-10"
        >
          {nextValue}
        </div>
      </div>
    </div>
  );
};