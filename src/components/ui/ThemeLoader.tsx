import React from 'react';

interface ThemeLoaderProps {
  size?: 'sm' | 'md' | 'lg';
}

const ThemeLoader: React.FC<ThemeLoaderProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
      <div className={`relative ${sizeClasses[size]} animate-spin-slow`}>
        <div className="absolute inset-0 rounded-full border-4 border-secondary/10" />
        <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-1/2 w-1/2 rotate-45 items-center justify-center rounded-sm bg-secondary shadow-lg animate-pulse">
            <span className="-rotate-45 text-[10px] font-black uppercase tracking-[0.15em] text-white">የኛFIX</span>
          </div>
        </div>
      </div>

      <span className="animate-pulse text-[10px] font-black uppercase tracking-[0.3em] text-secondary md:text-xs">
        Loading...
      </span>
    </div>
  );
};

export default ThemeLoader;
