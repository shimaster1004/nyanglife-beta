
import React, { useState } from 'react';
import { useStore } from '../store';
import { HealthTip } from '../types';
import { X, Filter } from 'lucide-react';
import { cn, formatDate } from '../lib/utils';

interface TipListModalProps {
  onClose: () => void;
  onSelectTip: (tip: HealthTip) => void;
}

export const TipListModal: React.FC<TipListModalProps> = ({ onClose, onSelectTip }) => {
  const { healthTips } = useStore();
  const [filter, setFilter] = useState<'ALL' | HealthTip['category']>('ALL');

  const filteredTips = filter === 'ALL' 
    ? healthTips 
    : healthTips.filter(t => t.category === filter);

  const getCategoryStyle = (cat: HealthTip['category']) => {
    switch (cat) {
        case 'HEALTH': return 'bg-blue-50 text-blue-600 border-blue-100';
        case 'FOOD': return 'bg-green-50 text-green-600 border-green-100';
        case 'BEHAVIOR': return 'bg-purple-50 text-purple-600 border-purple-100';
        default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-[90vh] rounded-t-3xl flex flex-col shadow-xl animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">건강 정보 리스트</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar border-b border-gray-50 shrink-0">
             {['ALL', 'HEALTH', 'FOOD', 'BEHAVIOR'].map((cat) => (
                 <button
                    key={cat}
                    onClick={() => setFilter(cat as any)}
                    className={cn(
                        "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors",
                        filter === cat 
                            ? "bg-gray-900 text-white" 
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                 >
                    {cat === 'ALL' ? '전체' : cat}
                 </button>
             ))}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-20">
            <div className="grid grid-cols-1 gap-4">
                {filteredTips.map((tip) => (
                    <div 
                        key={tip.id} 
                        onClick={() => onSelectTip(tip)}
                        className="flex gap-4 p-3 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99]"
                    >
                        <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                            <img src={tip.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", getCategoryStyle(tip.category))}>
                                    {tip.category}
                                </span>
                                <span className="text-[10px] text-gray-400">{formatDate(tip.created_at)}</span>
                            </div>
                            <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 mb-1">
                                {tip.title}
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-1">
                                {tip.content.replace(/#/g, '').substring(0, 30)}...
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {filteredTips.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <p>해당 카테고리의 콘텐츠가 없습니다.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
