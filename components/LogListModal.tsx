import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { HealthLog } from '../types';
import { X, PlayCircle, Activity, Droplets, Stethoscope, AlertCircle, Weight } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';
import { HealthLogForm } from './HealthLogForm';

interface LogListModalProps {
    onClose: () => void;
    initialFilter?: HealthLog['log_type'] | 'REPORT';
    hideFilters?: boolean;
}

export const LogListModal: React.FC<LogListModalProps> = ({ onClose, initialFilter, hideFilters }) => {
    const { logs, currentCatId, appointments, healthTips } = useStore();
    const [filter, setFilter] = useState<HealthLog['log_type'] | 'ALL' | 'REPORT'>(initialFilter || 'ALL');
    const [selectedLog, setSelectedLog] = useState<HealthLog | null>(null);

    const monthlyTip = useMemo(() => {
        if (!healthTips || healthTips.length === 0) return null;
        const month = new Date().getMonth();
        return healthTips[month % healthTips.length];
    }, [healthTips]);

    const filteredLogs = logs
        .filter(l => l.cat_id === currentCatId)
        .filter(l => filter === 'ALL' || filter === 'REPORT' ? true : l.log_type === filter)
        .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime());



    // Statistics Calculation
    const stats = useMemo(() => {
        if (filter !== 'REPORT') return null;
        const thisMonth = new Date().getMonth();
        const monthlyLogs = logs.filter(l => l.cat_id === currentCatId && new Date(l.visit_date).getMonth() === thisMonth);

        const totalActivity = monthlyLogs
            .filter(l => l.log_type === 'ACTIVITY')
            .reduce((sum, l) => sum + (Number(l.value) || 0), 0);

        const avgWeight = monthlyLogs
            .filter(l => l.log_type === 'WEIGHT')
            .reduce((sum, l, _, arr) => sum + (Number(l.value) || 0) / (arr.length || 1), 0);

        const hospitalVisitsCount = appointments
            ? appointments.filter(a => {
                if (a.cat_id !== currentCatId) return false;
                const d = new Date(a.date);
                return d.getMonth() === thisMonth;
            }).length
            : 0;

        return { totalActivity, avgWeight, logCount: monthlyLogs.length, hospitalVisitsCount };
    }, [logs, currentCatId, filter, appointments]);

    const getIcon = (type: HealthLog['log_type']) => {
        switch (type) {
            case 'ACTIVITY': return <PlayCircle size={20} />;
            case 'WEIGHT': return <Weight size={20} />;
            case 'WATER': return <Droplets size={20} />;
            case 'HOSPITAL': return <Stethoscope size={20} />;
            case 'SYMPTOM': return <AlertCircle size={20} />;
            case 'STOOL': return <Activity size={20} />;
            default: return <Activity size={20} />;
        }
    };

    const getColor = (type: HealthLog['log_type']) => {
        switch (type) {
            case 'ACTIVITY': return 'text-green-500 bg-green-50';
            case 'WEIGHT': return 'text-orange-500 bg-orange-50';
            case 'WATER': return 'text-blue-500 bg-blue-50';
            case 'HOSPITAL': return 'text-purple-500 bg-purple-50';
            case 'SYMPTOM': return 'text-red-500 bg-red-50';
            case 'STOOL': return 'text-yellow-600 bg-yellow-50';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    const getLabel = (type: HealthLog['log_type']) => {
        switch (type) {
            case 'ACTIVITY': return '활동';
            case 'WEIGHT': return '체중';
            case 'WATER': return '음수';
            case 'HOSPITAL': return '병원';
            case 'SYMPTOM': return '증상';
            case 'STOOL': return '대소변';
            default: return '기타';
        }
    };

    const getTitle = () => {
        if (hideFilters && filter !== 'ALL' && filter !== 'REPORT') {
            return `${getLabel(filter)} 기록`;
        }
        return filter === 'REPORT' ? '이번 달 리포트' : '기록 모아보기';
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-t-3xl h-[90dvh] flex flex-col shadow-xl animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">
                        {getTitle()}
                    </h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                        <X size={20} />
                    </button>
                </div>

                {/* Filter Tabs */}
                {!hideFilters && (
                    <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar border-b border-gray-50 shrink-0">
                        <button
                            onClick={() => setFilter('ALL')}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
                                filter === 'ALL' ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            )}
                        >
                            전체
                        </button>
                        <button
                            onClick={() => setFilter('REPORT')}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
                                filter === 'REPORT' ? "bg-indigo-500 text-white" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                            )}
                        >
                            📊 리포트
                        </button>
                        {['ACTIVITY', 'WEIGHT', 'WATER', 'STOOL', 'HOSPITAL', 'SYMPTOM'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type as any)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors",
                                    filter === type ? "bg-primary text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                )}
                            >
                                {getLabel(type as any)}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3">
                    {filter === 'REPORT' && stats ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-orange-50 p-4 rounded-2xl">
                                    <span className="text-xs text-orange-600 font-bold block mb-1">평균 체중</span>
                                    <span className="text-2xl font-black text-gray-900">{stats.avgWeight.toFixed(1)}</span>
                                    <span className="text-sm text-gray-500 ml-1">kg</span>
                                </div>
                                <div className="bg-green-50 p-4 rounded-2xl">
                                    <span className="text-xs text-green-600 font-bold block mb-1">총 활동량</span>
                                    <span className="text-2xl font-black text-gray-900">{stats.totalActivity}</span>
                                    <span className="text-sm text-gray-500 ml-1">분</span>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-2xl">
                                    <span className="text-xs text-purple-600 font-bold block mb-1">병원 방문</span>
                                    <span className="text-2xl font-black text-gray-900">{stats.hospitalVisitsCount}</span>
                                    <span className="text-sm text-gray-500 ml-1">회</span>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl">
                                    <span className="text-xs text-gray-600 font-bold block mb-1">총 기록</span>
                                    <span className="text-2xl font-black text-gray-900">{stats.logCount}</span>
                                    <span className="text-sm text-gray-500 ml-1">개</span>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-2xl">
                                <h3 className="font-bold text-blue-900 mb-2">💡 이달의 건강 팁</h3>
                                <p className="text-sm text-blue-800 leading-relaxed">
                                    {monthlyTip ? monthlyTip.title : "환절기에는 고양이의 음수량이 줄어들 수 있어요. 습식 사료나 물그릇 위치를 바꿔보세요!"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        filteredLogs.length > 0 ? (
                            filteredLogs.map(log => (
                                <div
                                    key={log.id}
                                    onClick={() => setSelectedLog(log)}
                                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 active:scale-[0.98] transition-transform cursor-pointer"
                                >
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", getColor(log.log_type))}>
                                        {getIcon(log.log_type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                                                {getLabel(log.log_type)}
                                            </span>
                                            <span className="text-xs text-gray-400">{formatDate(log.visit_date)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 mb-1">
                                            {log.log_type === 'STOOL' ? (
                                                <span className={cn(
                                                    "text-sm font-bold px-2 py-1 rounded-lg",
                                                    log.value === '정상' ? "text-green-600 bg-green-50" :
                                                        log.value === '혈변' ? "text-red-600 bg-red-50" :
                                                            ['무름', '설사', '소변실수'].includes(String(log.value)) ? "text-orange-600 bg-orange-50" :
                                                                "text-gray-600 bg-gray-50"
                                                )}>
                                                    {log.value}
                                                </span>
                                            ) : (
                                                <>
                                                    {log.value && <span className="text-lg font-bold text-gray-900">{log.value}</span>}
                                                    {log.log_type === 'WEIGHT' && <span className="text-xs text-gray-500">kg</span>}
                                                    {log.log_type === 'ACTIVITY' && <span className="text-xs text-gray-500">분</span>}
                                                    {log.log_type === 'WATER' && <span className="text-xs text-gray-500">ml</span>}
                                                </>
                                            )}
                                        </div>
                                        {log.note && <p className="text-sm text-gray-600 line-clamp-2">{log.note}</p>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400">
                                <p>기록이 없습니다.</p>
                            </div>
                        )
                    )}
                </div>

                {selectedLog && (
                    <HealthLogForm
                        type={selectedLog.log_type}
                        initialData={selectedLog}
                        onClose={() => setSelectedLog(null)}
                    />
                )}
            </div>
        </div>
    );
};
