
import React, { useState } from 'react';
import { BREEDS } from '../lib/breeds';
import { X, Search, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface BreedSelectorProps {
  onSelect: (breedCode: string) => void;
  onClose: () => void;
  selectedCode?: string;
}

export const BreedSelector: React.FC<BreedSelectorProps> = ({ onSelect, onClose, selectedCode }) => {
  const [search, setSearch] = useState('');

  const filteredBreeds = BREEDS.filter(b => 
    b.name.includes(search) || b.code.includes(search.toUpperCase())
  );

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl h-[80vh] flex flex-col shadow-xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">품종 선택</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-50">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder="품종 이름 검색 (예: 코숏, 러시안블루)"
               className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               autoFocus
             />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 pb-20">
            {filteredBreeds.map((breed) => (
                <button 
                  key={breed.code}
                  onClick={() => onSelect(breed.code)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors text-left group border border-transparent",
                    selectedCode === breed.code ? "bg-orange-50 border-orange-100" : ""
                  )}
                >
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800">{breed.name}</span>
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{breed.origin}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1 text-left">{breed.personality}</p>
                    </div>
                    {selectedCode === breed.code && <Check className="text-primary" size={18} />}
                </button>
            ))}
            {filteredBreeds.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                    <p>검색 결과가 없습니다.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
