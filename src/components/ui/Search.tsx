import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';

interface SearchOption {
  id: string | number;
  label: string;
  value: string;
}

interface SearchProps {
  label?: string; // Kept in interface to prevent breaking changes elsewhere
  placeholder?: string;
  value: string;
  options?: SearchOption[];
  onChange: (value: string) => void;
  onSelect?: (option: SearchOption) => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  className?: string;
  statusValue?: string;
  statusOptions?: Array<{ label: string; value: string }>;
  onStatusChange?: (value: string) => void;
}

const Search = ({
  placeholder = 'Type to search...',
  value,
  options = [],
  onChange,
  onSelect,
  onSubmit,
  isLoading,
  className = '',
  statusValue = '',
  statusOptions = [],
  onStatusChange,
}: SearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const filteredOptions = useMemo(() => {
    if (!value.trim()) return options;
    const query = value.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(query));
  }, [options, value]);

  useEffect(() => {
    if (value.trim().length > 0 && filteredOptions.length > 0) {
      setIsOpen(true);
    } else if (value.trim().length === 0) {
      setIsOpen(false);
    }
  }, [filteredOptions.length, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
    setHighlightedIndex(0);
  };

  const handleOptionSelect = (option: SearchOption) => {
    onSelect?.(option);
    onChange(option.label);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filteredOptions.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((current) => Math.min(current + 1, filteredOptions.length - 1));
      setIsOpen(true);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((current) => Math.max(current - 1, 0));
      setIsOpen(true);
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (isOpen && filteredOptions[highlightedIndex]) {
        handleOptionSelect(filteredOptions[highlightedIndex]);
      } else {
        onSubmit?.();
      }
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full font-sans ${className}`}>
      
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="flex w-full h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm transition-all duration-200 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100">
          <div className="flex items-center flex-1 pl-2 gap-2 h-full">
            <SearchIcon className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              onFocus={() => setIsOpen(filteredOptions.length > 0)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none h-full"
            />
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="rounded-lg bg-slate-900 px-4 h-full text-xs font-medium text-white transition-all duration-200 hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 flex items-center justify-center"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {statusOptions.length > 0 && (
          <select
            value={statusValue}
            onChange={(event) => onStatusChange?.(event.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium capitalize text-slate-700 shadow-sm outline-none md:min-w-[180px]"
          >
            <option value="" className="text-sm font-medium capitalize">All Statuses</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value} className="text-sm font-medium capitalize">
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Results Dropdown Menu Box */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-20 mt-1.5 max-h-60 overflow-hidden overflow-y-auto rounded-xl border border-slate-100 bg-white py-1 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full text-left px-4 h-9 text-xs transition-colors duration-150 flex items-center ${
                  index === highlightedIndex
                    ? 'bg-slate-50 text-slate-900 font-medium'
                    : 'bg-white text-slate-600 hover:bg-slate-50/50'
                }`}
              >
                <span className="block truncate">
                  {option.label}
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 h-9 text-xs text-slate-400 italic flex items-center">
              <span className="block truncate">
                No matching results found.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;