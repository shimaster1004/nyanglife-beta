import React, { useState } from 'react';
import { useStore } from '../store';
import { HomeCheck } from '../types';
import { X, Trash2, AlertCircle, CheckCircle, AlertTriangle, Droplets, Smile, ChevronRight } from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import { Button } from './ui/Button';

interface HomeCheckModalProps {
  onClose: () => void;
}

type Tab = 'NEW' | 'HISTORY';

export const HomeCheckModal: React.FC<HomeCheckModalProps> = ({ onClose }) => {
  const { currentCatId, homeChecks, addHomeCheck, deleteHomeCheck } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('NEW');
  const [checkType, setCheckType] = useState<'URINE' | 'DENTAL'>('URINE');
  const [result, setResult] = useState<HomeCheck['result'] | null>(null);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const catChecks = homeChecks.filter(c => c.cat_id === currentCatId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    addHomeCheck({
      check_type: checkType,
      result,
      check_date: date,
      note,
    });
    // Reset form but stay on modal, maybe switch to history?
    setNote('');
    setResult(null);
    setActiveTab('HISTORY');
  };

  const getResultColor = (res: HomeCheck['result']) => {
    switch(res) {
      case 'NORMAL': return 'text-green-600 bg-green-50 border-green-200';
      case 'WARNING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'DANGER': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const renderGuide = () => {
    if (checkType === 'URINE') {
      return (
        <div className="bg-blue-50 p-4 rounded-xl mb-6">
          <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
            <Droplets size={18} /> 소변 검사 가이드
          </h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
            <li>감자(소변 덩어리)의 크기가 평소보다 작나요?</li>
            <li>하루 2~3회 이상 정상적으로 배뇨하나요?</li>
            <li>피가 섞여 있거나 냄새가 독하지 않나요?</li>
          </ul>
        </div>
      );
    }
    return (
      <div className="bg-pink-50 p-4 rounded-xl mb-6">
        <h4 className="font-bold text-pink-800 flex items-center gap-2 mb-2">
          <Smile size={18} /> 치아 검사 가이드
        </h4>
        <ul className="text-sm text-pink-700 space-y-1 list-disc pl-4">
          <li>잇몸이 붉게 부어오르지 않았나요?</li>
          <li>입냄새가 심하게 나지 않나요?</li>
          <li>침을 과도하게 흘리지 않나요?</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl h-[85vh] flex flex-col shadow-xl animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">집에서 건강 체크</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 mx-6 mt-4 bg-gray-100 rounded-xl shrink-0">
          <button 
            onClick={() => setActiveTab('NEW')}
            className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'NEW' ? "bg-white text-primary shadow-sm" : "text-gray-500")}
          >
            새로 기록
          </button>
          <button 
            onClick={() => setActiveTab('HISTORY')}
            className={cn("flex-1 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'HISTORY' ? "bg-white text-primary shadow-sm" : "text-gray-500")}
          >
            히스토리
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 pb-40">
          {activeTab === 'NEW' ? (
            <form onSubmit={handleSubmit}>
              {/* Type Selection */}
              <div className="flex gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setCheckType('URINE')}
                  className={cn(
                    "flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                    checkType === 'URINE' ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-400"
                  )}
                >
                  <Droplets size={24} />
                  <span className="font-bold">소변 검사</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCheckType('DENTAL')}
                  className={cn(
                    "flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                    checkType === 'DENTAL' ? "border-pink-500 bg-pink-50 text-pink-700" : "border-gray-200 text-gray-400"
                  )}
                >
                  <Smile size={24} />
                  <span className="font-bold">치아 검사</span>
                </button>
              </div>

              {renderGuide()}

              {/* Date */}
              <div className="mb-6">
                 <label className="block text-sm font-bold text-gray-700 mb-2">검사 날짜</label>
                 <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-gray-800"
                />
              </div>

              {/* Result Selection */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">결과 판정</label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setResult('NORMAL')}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all text-left",
                      result === 'NORMAL' ? "border-green-500 bg-green-50" : "border-gray-200"
                    )}
                  >
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border-2", result === 'NORMAL' ? "border-green-500 bg-green-500" : "border-gray-300")}>
                      {result === 'NORMAL' && <CheckCircle size={14} className="text-white" />}
                    </div>
                    <div>
                      <span className="font-bold text-green-700 block">정상 (Normal)</span>
                      <span className="text-xs text-gray-500">특이 소견이 없고 건강해 보입니다.</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResult('WARNING')}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all text-left",
                      result === 'WARNING' ? "border-yellow-500 bg-yellow-50" : "border-gray-200"
                    )}
                  >
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border-2", result === 'WARNING' ? "border-yellow-500 bg-yellow-500" : "border-gray-300")}>
                      {result === 'WARNING' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div>
                      <span className="font-bold text-yellow-700 block">주의 (Warning)</span>
                      <span className="text-xs text-gray-500">약간의 변화가 있어 지켜봐야 합니다.</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResult('DANGER')}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all text-left",
                      result === 'DANGER' ? "border-red-500 bg-red-50" : "border-gray-200"
                    )}
                  >
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border-2", result === 'DANGER' ? "border-red-500 bg-red-500" : "border-gray-300")}>
                      {result === 'DANGER' && <AlertTriangle size={14} className="text-white" />}
                    </div>
                    <div>
                      <span className="font-bold text-red-700 block">위험 (Danger)</span>
                      <span className="text-xs text-gray-500">즉시 병원 방문이 필요해 보입니다.</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Note */}
              <div className="mb-6">
                 <label className="block text-sm font-bold text-gray-700 mb-2">메모 (선택)</label>
                 <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="특이사항을 기록해주세요."
                  rows={3}
                  className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <Button type="submit" disabled={!result} className="w-full h-14 text-lg shadow-lg shadow-orange-200">
                저장하기
              </Button>
            </form>
          ) : (
            /* History Tab */
            <div className="space-y-4">
              {catChecks.length === 0 ? (
                 <div className="text-center py-10 text-gray-400">
                    <p>아직 기록된 검진이 없습니다.</p>
                 </div>
              ) : (
                catChecks
                  .sort((a, b) => new Date(b.check_date).getTime() - new Date(a.check_date).getTime())
                  .map((check) => (
                  <div key={check.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full border", getResultColor(check.result))}>
                          {check.result}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">{formatDate(check.check_date)}</span>
                      </div>
                      <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
                        {check.check_type === 'URINE' ? <Droplets size={16} className="text-blue-500"/> : <Smile size={16} className="text-pink-500"/>}
                        {check.check_type === 'URINE' ? '소변 검사' : '치아 검사'}
                      </h4>
                      {check.note && <p className="text-sm text-gray-500 mt-1">{check.note}</p>}
                    </div>
                    <button 
                      onClick={() => deleteHomeCheck(check.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};