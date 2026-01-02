import React, { useEffect, useRef, useState } from 'react';
import { TableInfo } from '../utils/ghostTextSuggestions';

export interface AutocompleteItem {
  label: string;
  type: 'column' | 'table' | 'keyword' | 'function' | 'join_condition';
  tableName?: string;
}

interface AutocompleteDropdownProps {
  items: AutocompleteItem[];
  visible: boolean;
  position: { top: number; left: number };
  onSelect: (item: AutocompleteItem) => void;
  onClose: () => void;
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
}

const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  items,
  visible,
  position,
  onSelect,
  onClose,
  selectedIndex,
  onSelectedIndexChange,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll selected item into view
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible || items.length === 0) {
    return null;
  }

  const getTypeIcon = (type: AutocompleteItem['type']) => {
    switch (type) {
      case 'column':
        return <span className="text-blue-400 text-[10px] font-bold">COL</span>;
      case 'table':
        return <span className="text-emerald-400 text-[10px] font-bold">TBL</span>;
      case 'keyword':
        return <span className="text-green-400 text-[10px] font-bold">KEY</span>;
      case 'function':
        return <span className="text-amber-400 text-[10px] font-bold">FN</span>;
      case 'join_condition':
        return <span className="text-purple-400 text-[10px] font-bold">REL</span>;
      default:
        return null;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute z-50 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl shadow-black/50 overflow-hidden backdrop-blur-xl"
      style={{
        top: position.top,
        left: position.left,
        minWidth: '180px',
        maxWidth: '250px',
      }}
    >
      <div className="overflow-y-auto max-h-[72px] custom-scrollbar">
        {items.map((item, index) => (
          <button
            key={`${item.type}-${item.label}-${index}`}
            ref={(el) => { itemRefs.current[index] = el; }}
            onClick={() => onSelect(item)}
            onMouseEnter={() => onSelectedIndexChange(index)}
            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
              index === selectedIndex
                ? 'bg-blue-600/30 text-white'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <span className="w-7 flex justify-center">
              {getTypeIcon(item.type)}
            </span>
            <span className="font-mono truncate">{item.label}</span>
            {item.tableName && (
              <span className="ml-auto text-xs text-slate-500 truncate">
                {item.tableName}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="px-3 py-1.5 bg-black/30 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
        <span>↑↓ Naviga</span>
        <span>↵ Inserisci</span>
        <span>Esc Chiudi</span>
      </div>
    </div>
  );
};

export default AutocompleteDropdown;
