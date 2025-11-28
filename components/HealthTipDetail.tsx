
import React from 'react';
import { HealthTip } from '../types';
import { X, Calendar, Share2 } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';
import { Button } from './ui/Button';

interface HealthTipDetailProps {
  tip: HealthTip;
  onClose: () => void;
}

export const HealthTipDetail: React.FC<HealthTipDetailProps> = ({ tip, onClose }) => {
  const getCategoryColor = (cat: HealthTip['category']) => {
    switch (cat) {
      case 'HEALTH': return 'bg-blue-100 text-blue-600';
      case 'FOOD': return 'bg-green-100 text-green-600';
      case 'BEHAVIOR': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tip.title,
          text: tip.content.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${tip.title}\n\n${tip.content}`);
        alert('내용이 클립보드에 복사되었습니다!');
      } catch (err) {
        alert('공유하기를 지원하지 않는 브라우저입니다.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-[90vh] rounded-t-3xl flex flex-col shadow-xl animate-in slide-in-from-bottom duration-300 overflow-hidden">

        {/* Header Image Area */}
        <div className="relative h-64 shrink-0">
          <img
            src={tip.thumbnail_url}
            alt={tip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/50 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full mb-2 inline-block shadow-sm uppercase", getCategoryColor(tip.category).replace('bg-', 'bg-white/90 text-'))}>
              {tip.category}
            </span>
            <h1 className="text-2xl font-black text-white leading-tight shadow-sm drop-shadow-md">
              {tip.title}
            </h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-white relative -mt-4 rounded-t-3xl pb-24">
          <div className="flex items-center justify-between mb-6 text-gray-400 text-xs border-b border-gray-100 pb-4">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(tip.created_at)}</span>
            </div>
            <button onClick={handleShare} className="flex items-center gap-1 hover:text-primary">
              <Share2 size={14} />
              <span>공유하기</span>
            </button>
          </div>

          {/* Simple Markdown Rendering */}
          <div className="prose prose-sm prose-orange text-gray-700 space-y-4">
            {tip.content.split('\n').map((line, index) => {
              if (line.startsWith('# ')) return <h2 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-2">{line.replace('# ', '')}</h2>;
              if (line.startsWith('### ')) return <h3 key={index} className="text-lg font-bold text-gray-800 mt-4 mb-2">{line.replace('### ', '')}</h3>;
              if (line.startsWith('- ')) return <li key={index} className="ml-4 list-disc">{line.replace('- ', '')}</li>;
              if (/^\d+\./.test(line)) return <div key={index} className="font-bold text-gray-900 mt-2">{line}</div>;
              if (line.trim() === '') return <br key={index} />;
              return <p key={index} className="leading-relaxed">{line}</p>;
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0 pb-8">
          <Button onClick={onClose} variant="secondary" className="w-full">
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
};
