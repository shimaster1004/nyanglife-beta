import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { X, Calendar, Camera, Trash2, AlertCircle } from 'lucide-react';
import { HealthLog } from '../types';

import { StoolGuideModal } from './StoolGuideModal';

interface HealthLogFormProps {
  type: 'WEIGHT' | 'HOSPITAL' | 'SYMPTOM' | 'WATER' | 'STOOL' | 'ACTIVITY';
  onClose: () => void;
  initialData?: HealthLog | null;
}

export const HealthLogForm: React.FC<HealthLogFormProps> = ({ type, onClose, initialData }) => {
  const { addLog, updateLog, deleteLog, isLoading } = useStore();
  const [value, setValue] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (initialData) {
      setValue(initialData.value ? String(initialData.value) : '');
      setNote(initialData.note || '');
      if (initialData.visit_date) {
        setDate(initialData.visit_date.split('T')[0]);
      }
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const logData = {
      log_type: type,
      visit_date: date,
      value: type === 'WEIGHT' ? parseFloat(value) : value,
      note,
    };

    if (initialData && initialData.id) {
      await updateLog(initialData.id, logData);
    } else {
      await addLog(logData);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (initialData && confirm('정말 삭제하시겠습니까?')) {
      await deleteLog(initialData.id);
      onClose();
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'WEIGHT': return '몸무게 기록';
      case 'WATER': return '음수량 기록';
      case 'HOSPITAL': return '병원 방문';
      case 'SYMPTOM': return '이상 증상';
      case 'STOOL': return '대소변 상태';
      case 'ACTIVITY': return '활동/놀이 기록';
      default: return '기록하기';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl h-[85vh] flex flex-col shadow-xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">{initialData ? '기록 수정' : getTitle()}</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pb-40">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date Picker */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">날짜</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 pl-10 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-gray-800"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            {/* Dynamic Inputs */}
            {type === 'WEIGHT' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">몸무게 (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="0.0"
                  className="w-full p-4 text-2xl font-bold text-center bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50"
                  autoFocus={!initialData}
                />
              </div>
            )}

            {type === 'WATER' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">섭취량 (ml)</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[50, 100, 150, 200].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setValue(amt.toString())}
                      className={`py-2 rounded-lg text-sm font-medium transition-colors ${value === amt.toString() ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {amt}ml
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="직접 입력"
                  className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )}

            {type === 'STOOL' && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-bold text-gray-700">대소변 상태</label>
                  <button
                    type="button"
                    onClick={() => setShowGuide(true)}
                    className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full hover:bg-orange-100 transition-colors flex items-center gap-1"
                  >
                    <AlertCircle size={10} />
                    상식 보기
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {['정상', '무름', '설사', '딱딱함', '혈변', '소변실수'].map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setValue(status)}
                      className={`py-2 rounded-lg text-sm font-medium transition-colors ${value === status ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-bold text-gray-700 mb-1">메모</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="특이사항을 적어주세요."
                  rows={3}
                  className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <div className="mt-3">
                  <button type="button" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Camera size={20} />
                    </div>
                    <span>사진 추가하기</span>
                  </button>
                </div>
              </div>
            )}

            {(type === 'SYMPTOM' || type === 'HOSPITAL' || type === 'ACTIVITY') && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  {type === 'ACTIVITY' ? '놀이 시간 (분)' : '내용'}
                </label>
                {type === 'ACTIVITY' ? (
                  <div className="mb-4">
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="예: 15"
                      className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                ) : null}

                <label className="block text-sm font-bold text-gray-700 mb-1">메모</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="자세한 내용을 적어주세요."
                  rows={3}
                  className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <div className="mt-3">
                  <button type="button" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Camera size={20} />
                    </div>
                    <span>사진 추가하기</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              {initialData && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 border-red-100 text-red-500 hover:bg-red-50"
                  onClick={handleDelete}
                >
                  <Trash2 size={18} className="mr-2" />
                  삭제
                </Button>
              )}
              <Button type="submit" className="flex-[2] h-12 text-lg shadow-lg shadow-orange-200" isLoading={isLoading}>
                {initialData ? '수정하기' : '저장하기'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      {showGuide && <StoolGuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
};