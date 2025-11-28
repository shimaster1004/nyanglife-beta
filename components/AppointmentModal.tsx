import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { X, Calendar, Clock, MapPin, FileText, Trash2 } from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentModalProps {
    onClose: () => void;
    initialData?: Appointment | null;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ onClose, initialData }) => {
    const { addAppointment, updateAppointment, deleteAppointment, isLoading } = useStore();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('10:00');
    const [hospitalName, setHospitalName] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDate(initialData.date);
            setTime(initialData.time);
            setHospitalName(initialData.hospital_name);
            setNotes(initialData.notes || '');
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !time || !hospitalName) {
            alert('모든 필수 항목을 입력해주세요.');
            return;
        }

        if (initialData) {
            await updateAppointment(initialData.id, {
                title,
                date,
                time,
                hospital_name: hospitalName,
                notes
            });
        } else {
            await addAppointment({
                title,
                date,
                time,
                hospital_name: hospitalName,
                notes
            });
        }
        onClose();
    };

    const handleDelete = async () => {
        if (!initialData) return;
        if (confirm('정말로 이 예약을 삭제하시겠습니까?')) {
            await deleteAppointment(initialData.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-t-3xl h-[85vh] flex flex-col shadow-xl animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? '병원 예약 수정' : '병원 예약 등록'}
                    </h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 pb-40">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">예약명 (필수)</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="예: 정기 건강검진, 3차 예방접종"
                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50"
                                autoFocus={!initialData}
                            />
                        </div>

                        {/* Hospital Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">병원 이름 (필수)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={hospitalName}
                                    onChange={(e) => setHospitalName(e.target.value)}
                                    placeholder="방문할 병원 이름을 입력하세요"
                                    className="w-full p-3 pl-10 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50"
                                />
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
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
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">시간</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full p-3 pl-10 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50 text-gray-800"
                                    />
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">메모</label>
                            <div className="relative">
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="의사 선생님께 여쭤볼 내용이나 특이사항을 적어주세요."
                                    rows={4}
                                    className="w-full p-3 pl-10 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/50 resize-none"
                                />
                                <FileText className="absolute left-3 top-4 text-gray-400" size={18} />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            {initialData && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="flex-1 h-12 flex items-center justify-center gap-2 text-red-500 font-bold bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 size={18} />
                                    삭제
                                </button>
                            )}
                            <Button
                                type="submit"
                                className={`h-12 text-lg shadow-lg shadow-orange-200 ${initialData ? 'flex-[2]' : 'w-full'}`}
                                isLoading={isLoading}
                            >
                                {initialData ? '수정 완료' : '예약 등록하기'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
