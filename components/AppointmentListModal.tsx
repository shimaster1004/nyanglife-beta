import React, { useState } from 'react';
import { useStore } from '../store';
import { Appointment } from '../types';
import { X, Calendar, Clock, MapPin, Trash2, Edit2 } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';
import { AppointmentModal } from './AppointmentModal';

interface AppointmentListModalProps {
    onClose: () => void;
}

export const AppointmentListModal: React.FC<AppointmentListModalProps> = ({ onClose }) => {
    const { appointments, currentCatId, deleteAppointment } = useStore();
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const catAppointments = appointments
        .filter(a => a.cat_id === currentCatId)
        .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());

    const upcoming = catAppointments.filter(a => new Date(a.date + 'T' + a.time) >= new Date());
    const past = catAppointments.filter(a => new Date(a.date + 'T' + a.time) < new Date()).reverse();

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('일정을 삭제하시겠습니까?')) {
            await deleteAppointment(id);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-t-3xl h-[85vh] flex flex-col shadow-xl animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">병원 방문 일정</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 pb-20 space-y-6">
                    {/* Upcoming Section */}
                    <div>
                        <h3 className="text-sm font-bold text-indigo-600 mb-3 flex items-center gap-2">
                            <Calendar size={16} /> 예정된 방문
                        </h3>
                        {upcoming.length > 0 ? (
                            <div className="space-y-3">
                                {upcoming.map(apt => (
                                    <div
                                        key={apt.id}
                                        onClick={() => setSelectedAppointment(apt)}
                                        className="bg-white border border-indigo-100 rounded-2xl p-4 shadow-sm active:scale-[0.99] transition-transform cursor-pointer hover:border-indigo-300 relative group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2 py-1 rounded-full">
                                                    {apt.date}
                                                </span>
                                                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                                    <Clock size={12} /> {apt.time}
                                                </span>
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-lg mb-1">{apt.title}</h4>
                                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                                            <MapPin size={14} />
                                            {apt.hospital_name}
                                        </div>
                                        {apt.notes && (
                                            <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded-lg">{apt.notes}</p>
                                        )}

                                        <button
                                            onClick={(e) => handleDelete(e, apt.id)}
                                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                예정된 일정이 없습니다.
                            </p>
                        )}
                    </div>

                    {/* Past Section */}
                    {past.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 mb-3">지난 방문</h3>
                            <div className="space-y-3 opacity-60">
                                {past.map(apt => (
                                    <div
                                        key={apt.id}
                                        onClick={() => setSelectedAppointment(apt)}
                                        className="bg-gray-50 border border-gray-100 rounded-2xl p-4 cursor-pointer"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-bold text-gray-700">{apt.title}</h4>
                                            <span className="text-xs text-gray-400">{apt.date}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">{apt.hospital_name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {selectedAppointment && (
                <AppointmentModal
                    initialData={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                />
            )}
        </div>
    );
};
