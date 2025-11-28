
import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Card } from './ui/Card';
import { TodoList } from './TodoList';
import { CatEditForm } from './CatEditForm';
import { HomeCheckModal } from './HomeCheckModal';
import { HealthTipDetail } from './HealthTipDetail';
import { HealthLogForm } from './HealthLogForm';
import { TipListModal } from './TipListModal';
import { AppointmentModal } from './AppointmentModal';
import { MedicationModal } from './MedicationModal';
import { LogListModal } from './LogListModal';
import { AppointmentListModal } from './AppointmentListModal';
import { VaccineGuideModal } from './VaccineGuideModal';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { Activity, Syringe, Weight, Droplets, Stethoscope, Settings, Plus, PlayCircle, AlertCircle, Calendar, Clock, MapPin, Pill } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';
import { HealthLog, HealthTip, Appointment, Medication } from '../types';
import { getBreedInfo } from '../lib/breeds';

const QuickActionBtn = ({ icon: Icon, label, onClick, colorClass }: any) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-transform"
  >
    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-1", colorClass)}>
      <Icon size={24} />
    </div>
    <span className="text-xs font-bold text-gray-600">{label}</span>
  </button>
);

const QuickActionBtnSmall = ({ icon: Icon, label, onClick, colorClass }: any) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-1 p-3 bg-white rounded-xl shadow-sm border border-gray-100 active:scale-95 transition-transform min-w-[70px]"
  >
    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", colorClass)}>
      <Icon size={16} />
    </div>
    <span className="text-[10px] font-bold text-gray-600">{label}</span>
  </button>
);

export const Dashboard: React.FC<{ onAddCat: () => void }> = ({ onAddCat }) => {
  const { cats, currentCatId, setCurrentCat, logs, homeChecks, healthTips, appointments, medications } = useStore();
  const [activeLogType, setActiveLogType] = useState<HealthLog['log_type'] | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showHomeCheck, setShowHomeCheck] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [selectedTip, setSelectedTip] = useState<HealthTip | null>(null);
  const [showAllTips, setShowAllTips] = useState(false);
  const [showLogList, setShowLogList] = useState<HealthLog['log_type'] | 'ALL' | 'REPORT' | null>(null);
  const [editingLog, setEditingLog] = useState<HealthLog | null>(null);
  const [showAppointmentList, setShowAppointmentList] = useState(false);
  const [showVaccineGuide, setShowVaccineGuide] = useState(false);
  const [isLogListFocused, setIsLogListFocused] = useState(false);

  const cat = cats.find(c => c.id === currentCatId);

  // Notification Check
  React.useEffect(() => {
    if (!currentCatId) return;

    const checkUpcoming = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // 1. Appointment Alarms
      const upcomingApt = appointments.find(a => {
        if (a.cat_id !== currentCatId) return false;
        const aptDate = new Date(a.date + 'T' + a.time);
        return aptDate > now && aptDate <= tomorrow;
      });

      if (upcomingApt) {
        console.log("Upcoming appointment:", upcomingApt.title);
      }

      // 2. Medication Alarms
      const activeMeds = medications.filter(m => {
        if (m.cat_id !== currentCatId) return false;
        const start = new Date(m.start_date);
        const end = m.end_date ? new Date(m.end_date) : null;
        return start <= now && (!end || end >= now);
      });

      if (activeMeds.length > 0) {
        console.log("Active medications:", activeMeds.length);
      }
    };

    checkUpcoming();
  }, [appointments, medications, currentCatId]);

  // Memoized calculations
  const getLifeCycleStage = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    if (ageInMonths < 12) return 'KITTEN';
    if (ageInMonths < 7 * 12) return 'ADULT';
    return 'SENIOR';
  };

  const getAgeDetails = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months };
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'KITTEN': return 'text-pink-500 font-bold';
      case 'ADULT': return 'text-blue-500 font-bold';
      case 'SENIOR': return 'text-purple-500 font-bold';
      default: return 'text-gray-500';
    }
  };

  const getNextVaccineInfo = (birthDate: string, logs: HealthLog[]) => {
    const today = new Date();
    const birth = new Date(birthDate);

    // Define Vaccine Schedule
    const schedule = [
      { title: '종합백신 1차', targetWeeks: 8 },
      { title: '종합백신 2차', targetWeeks: 12 },
      { title: '종합백신 3차', targetWeeks: 16 },
    ];

    // Find the first vaccine that hasn't been logged yet
    const nextVaccine = schedule.find(vaccine => {
      const isDone = logs.some(log =>
        log.cat_id === currentCatId &&
        log.log_type === 'HOSPITAL' &&
        log.note?.includes(vaccine.title)
      );
      return !isDone;
    });

    if (!nextVaccine) return null; // All completed

    const dueDate = new Date(birth);
    dueDate.setDate(dueDate.getDate() + nextVaccine.targetWeeks * 7);

    const dDay = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      title: nextVaccine.title,
      date: formatDate(dueDate.toISOString().split('T')[0]),
      dDay
    };
  };

  const lifecycle = useMemo(() => cat ? getLifeCycleStage(cat.birth_date) : 'ADULT', [cat]);
  const ageDetails = useMemo(() => cat ? getAgeDetails(cat.birth_date) : { years: 0, months: 0 }, [cat]);
  const breedInfo = useMemo(() => cat ? getBreedInfo(cat.breed_code) : null, [cat]);
  const vaccineInfo = useMemo(() => cat ? getNextVaccineInfo(cat.birth_date, logs) : null, [cat, logs]);

  const weightLogs = logs
    .filter(l => l.cat_id === currentCatId && l.log_type === 'WEIGHT')
    .sort((a, b) => new Date(a.visit_date).getTime() - new Date(b.visit_date).getTime())
    .map(l => ({ date: formatDate(l.visit_date), value: Number(l.value) }));

  // Upcoming Appointment
  const upcomingAppointment = useMemo(() => {
    if (!appointments) return null;
    const now = new Date();
    const future = appointments
      .filter(a => a.cat_id === currentCatId && new Date(a.date + 'T' + a.time) >= now)
      .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());
    return future.length > 0 ? future[0] : null;
  }, [appointments, currentCatId]);

  // Active Medications
  const activeMedications = useMemo(() => {
    if (!medications) return [];
    const now = new Date();
    return medications.filter(m => {
      if (m.cat_id !== currentCatId) return false;
      const start = new Date(m.start_date);
      const end = m.end_date ? new Date(m.end_date) : null;
      return start <= now && (!end || end >= now);
    });
  }, [medications, currentCatId]);

  // Home Check Signal Calculation
  const thisMonthChecks = homeChecks.filter(c => {
    if (c.cat_id !== currentCatId) return false;
    const d = new Date(c.check_date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  let signalStatus = 'NONE'; // NONE, GREEN, YELLOW, RED
  if (thisMonthChecks.some(c => c.result === 'DANGER')) signalStatus = 'RED';
  else if (thisMonthChecks.some(c => c.result === 'WARNING')) signalStatus = 'YELLOW';
  else if (thisMonthChecks.length > 0) signalStatus = 'GREEN';

  const getSignalText = () => {
    if (signalStatus === 'RED') return "병원 방문이 시급해요!";
    if (signalStatus === 'YELLOW') return "지속적인 관찰이 필요해요.";
    if (signalStatus === 'GREEN') return "아주 건강하게 관리중!";
    return "이번 달 검진 기록이 없어요";
  };

  const getSignalColor = () => {
    if (signalStatus === 'RED') return "text-red-500";
    if (signalStatus === 'YELLOW') return "text-yellow-600";
    if (signalStatus === 'GREEN') return "text-green-600";
    return "text-gray-400";
  };

  if (!cat) return <div className="p-6 text-center text-gray-500">고양이를 선택해주세요.</div>;

  return (
    <div className="p-6 pt-8 space-y-6 pb-24">
      {/* Header Profile */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer" onClick={() => setIsEditingProfile(true)}>
            <img
              src={cat.image_url || 'https://picsum.photos/200'}
              alt={cat.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
              {cat.gender === 'M' ? <span className="text-blue-500 text-xs font-bold px-1">♂</span> : <span className="text-pink-500 text-xs font-bold px-1">♀</span>}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 relative group">
              <h1 className="text-2xl font-black text-gray-800 cursor-pointer flex items-center gap-1">
                {cat.name}
              </h1>
              <button
                onClick={() => setIsEditingProfile(true)}
                className="text-gray-300 hover:text-gray-600 transition-colors p-1"
              >
                <Settings size={18} />
              </button>
            </div>

            {cats.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-1 max-w-[200px] no-scrollbar">
                {cats.filter(c => c.id !== cat.id).map(otherCat => (
                  <button
                    key={otherCat.id}
                    onClick={() => setCurrentCat(otherCat.id)}
                    className="shrink-0 text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200 hover:text-gray-600 transition-colors"
                  >
                    {otherCat.name}
                  </button>
                ))}
                <button
                  onClick={onAddCat}
                  className="shrink-0 text-xs font-bold text-primary bg-orange-50 px-2 py-1 rounded-full hover:bg-orange-100 transition-colors flex items-center gap-1"
                >
                  <Plus size={10} />
                  추가
                </button>
              </div>
            )}
            {cats.length === 1 && (
              <div className="flex gap-2 overflow-x-auto py-1 max-w-[200px] no-scrollbar">
                <button
                  onClick={onAddCat}
                  className="shrink-0 text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors flex items-center gap-1"
                >
                  <Plus size={10} />
                  고양이 추가
                </button>
              </div>
            )}

            <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
              <span>{ageDetails.years}살 {ageDetails.months}개월</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className={getStageColor(lifecycle)}>{lifecycle}</span>
            </p>
            {breedInfo && (
              <p className="text-xs text-gray-400 font-medium mt-0.5">{breedInfo.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Appointment Card */}
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="text-sm font-bold text-gray-500">병원 방문 일정</h3>
        <button
          onClick={() => setShowAppointmentList(true)}
          className="text-xs text-indigo-500 font-bold hover:underline"
        >
          전체보기
        </button>
      </div>

      {upcomingAppointment ? (
        <Card className="bg-white border-l-4 border-l-indigo-500 shadow-sm mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">D-{Math.ceil((new Date(upcomingAppointment.date).getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24))}</span>
                <span className="text-xs text-gray-400">{upcomingAppointment.date}</span>
              </div>
              <h3 className="font-bold text-lg text-gray-800">{upcomingAppointment.title}</h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{upcomingAppointment.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{upcomingAppointment.hospital_name}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedAppointment(upcomingAppointment);
                setShowAppointmentModal(true);
              }}
              className="p-2 text-gray-300 hover:text-indigo-500 transition-colors"
            >
              <Settings size={16} />
            </button>
          </div>
        </Card>
      ) : (
        <button
          onClick={() => {
            setSelectedAppointment(null);
            setShowAppointmentModal(true);
          }}
          className="w-full p-4 mb-6 rounded-2xl border border-dashed border-gray-300 flex items-center justify-center gap-2 text-gray-400 hover:bg-gray-50 hover:border-gray-400 transition-all"
        >
          <Calendar size={18} />
          <span className="font-bold text-sm">병원 방문 일정 등록하기</span>
        </button>
      )}

      {/* Report Button Area */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => {
            setShowLogList('REPORT');
            setIsLogListFocused(false);
          }}
          className="col-span-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-between group active:scale-[0.98] transition-all"
        >
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold opacity-80 mb-1">이번 달 건강 리포트</span>
            <span className="text-lg font-black">건강 분석 보기</span>
          </div>
          <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
            <Activity size={20} />
          </div>
        </button>
      </div>

      {/* Active Medications */}
      {activeMedications.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-gray-500 px-1">복용 중인 약</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {activeMedications.map(med => (
              <div key={med.id} className="shrink-0 bg-pink-50 p-3 rounded-2xl border border-pink-100 min-w-[140px] relative">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                    <Pill size={14} />
                  </div>
                  <span className="text-xs font-bold text-pink-600">하루 {med.frequency}회</span>
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{med.name}</h4>
                <p className="text-xs text-gray-500">{med.dosage}</p>
                <button
                  onClick={() => {
                    setSelectedMedication(med);
                    setShowMedicationModal(true);
                  }}
                  className="absolute top-2 right-2 text-pink-300 hover:text-pink-500"
                >
                  <Settings size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- ADAPTIVE LAYOUT SWITCH --- */}

      {/* 1. SENIOR MODE: Quick Actions Top */}
      {lifecycle === 'SENIOR' && (
        <div className="grid grid-cols-3 gap-3">
          <QuickActionBtn
            icon={Droplets}
            label="음수량"
            colorClass="bg-blue-50 text-blue-600"
            onClick={() => setActiveLogType('WATER')}
          />
          <QuickActionBtn
            icon={Activity}
            label="대소변"
            colorClass="bg-orange-50 text-orange-600"
            onClick={() => setActiveLogType('STOOL')}
          />
          <QuickActionBtn
            icon={Stethoscope}
            label="투약 관리"
            colorClass="bg-purple-50 text-purple-600"
            onClick={() => setShowMedicationModal(true)}
          />
          <button
            onClick={() => {
              setShowLogList('SYMPTOM');
              setIsLogListFocused(true);
            }}
            className="col-span-3 text-xs text-gray-400 font-bold text-right px-2 hover:text-gray-600 underline"
          >
            이상 징후 기록 모아보기 &gt;
          </button>
        </div>
      )}

      {/* 2. KITTEN MODE: Vaccine D-Day Card */}
      {lifecycle === 'KITTEN' && (
        <Card className="bg-gradient-to-br from-orange-400 to-pink-500 text-white border-none shadow-lg shadow-orange-200 overflow-visible relative">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <button
                onClick={() => setShowVaccineGuide(true)}
                className="flex items-center gap-2 mb-2 bg-white/20 w-fit px-2 py-1 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer"
              >
                <Syringe size={14} className="text-white" />
                <span className="text-[10px] font-bold tracking-wider">필수 접종</span>
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center opacity-80">
                  <span className="text-[8px] text-orange-500 font-bold">?</span>
                </div>
              </button>
              {vaccineInfo ? (
                <>
                  <h3 className="text-2xl font-black mb-1">
                    {vaccineInfo.dDay > 0 ? `D-${vaccineInfo.dDay}` : (vaccineInfo.dDay === 0 ? 'D-Day' : `D+${Math.abs(vaccineInfo.dDay)}`)}
                  </h3>
                  <p className="text-sm text-white/90 font-medium">{vaccineInfo.title} 예정일</p>
                  <p className="text-xs text-white/70 mt-1">{vaccineInfo.date}</p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-black mb-1">접종 완료! 👏</h3>
                  <p className="text-sm text-white/90 font-medium">기초 접종이 모두 끝났어요.</p>
                </>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditingLog({ log_type: 'HOSPITAL', note: vaccineInfo ? `${vaccineInfo.title} 접종` : '예방 접종' } as any);
                  }}
                  className="text-xs font-bold bg-white text-orange-500 px-4 py-2 rounded-full shadow-sm hover:bg-orange-50 transition-colors"
                >
                  접종 기록하기
                </button>
                <button
                  onClick={() => {
                    setShowLogList('HOSPITAL');
                    setIsLogListFocused(true);
                  }}
                  className="text-xs font-bold bg-white/20 text-white px-3 py-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  이력 확인
                </button>
              </div>
            </div>
            <div className="text-6xl opacity-20 absolute -right-2 -bottom-4 rotate-12">💉</div>
          </div>
        </Card>
      )}

      {/* Common: Health Signal Card (Traffic Light) */}
      <Card className="cursor-pointer active:scale-95 transition-transform border border-gray-100" onClick={() => setShowHomeCheck(true)}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Home Check</span>
            <div className="flex items-center gap-2">
              <h3 className={cn("font-bold text-lg", getSignalColor())}>
                {getSignalText()}
              </h3>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {signalStatus === 'NONE' ? "탭해서 첫 검진을 시작하세요." : "소변/치아 상태 모니터링 중"}
            </p>
          </div>

          {/* Traffic Light UI */}
          <div className="bg-gray-100 p-1.5 rounded-full flex flex-col gap-1.5 shadow-inner">
            <div className={cn("w-3 h-3 rounded-full transition-all duration-500", signalStatus === 'RED' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] scale-110" : "bg-gray-300 opacity-40")} />
            <div className={cn("w-3 h-3 rounded-full transition-all duration-500", signalStatus === 'YELLOW' ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)] scale-110" : "bg-gray-300 opacity-40")} />
            <div className={cn("w-3 h-3 rounded-full transition-all duration-500", signalStatus === 'GREEN' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] scale-110" : "bg-gray-300 opacity-40")} />
          </div>
        </div>
      </Card>

      {/* 3. ADULT MODE: BMI & Weight Management */}
      <div className="grid grid-cols-2 gap-4">
        {/* Weight Graph Card */}
        <Card className="flex flex-col justify-between col-span-1 cursor-pointer active:scale-95 transition-transform" onClick={() => setActiveLogType('WEIGHT')}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-xs font-bold">
              {lifecycle === 'KITTEN' ? '성장 기록' : '체중 관리'}
            </span>
            <Weight size={14} className="text-primary" />
          </div>
          <div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black text-gray-800">{cat.weight_kg}</span>
              <span className="text-sm text-gray-500 font-medium mb-1">kg</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">지난달 대비 +0.1kg</p>
          </div>
          <div className="h-10 mt-3 -mx-2 opacity-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightLogs.length > 0 ? weightLogs : [{ date: '', value: 0 }]}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eb9947" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#eb9947" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#eb9947" strokeWidth={2} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Dynamic Second Card based on Stage */}
        <div className="grid grid-rows-2 gap-3 h-44">
          {lifecycle === 'ADULT' ? (
            <>
              <QuickActionBtnSmall
                icon={Activity}
                label="활동/놀이"
                onClick={() => setActiveLogType('ACTIVITY')}
                colorClass="bg-green-50 text-green-600"
              />
              <QuickActionBtnSmall
                icon={Droplets}
                label="음수량"
                onClick={() => setActiveLogType('WATER')}
                colorClass="bg-blue-50 text-blue-600"
              />
            </>
          ) : lifecycle === 'KITTEN' ? (
            <Card className="row-span-2 bg-blue-50 border-none flex flex-col justify-center items-center text-center p-2" noPadding>
              <h4 className="text-blue-900 font-bold text-sm mb-1">사회화 시기</h4>
              <p className="text-[10px] text-blue-700 leading-tight">다양한 소리와<br />사람을 만나게<br />해주세요!</p>
            </Card>
          ) : (
            // Senior Mode - Already has top buttons, maybe show symptom here
            <Card className="row-span-2 bg-red-50 border-none flex flex-col justify-center items-center text-center cursor-pointer hover:bg-red-100 transition-colors" noPadding onClick={() => setActiveLogType('SYMPTOM')}>
              <AlertCircle className="text-red-500 mb-1" size={24} />
              <h4 className="text-red-900 font-bold text-sm">이상 징후</h4>
              <p className="text-[10px] text-red-700">작은 변화도<br />기록하세요</p>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Activity Logs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-gray-800">최근 활동 기록</h3>
          <button
            onClick={() => {
              setShowLogList('ACTIVITY');
              setIsLogListFocused(true);
            }}
            className="text-xs text-primary font-bold hover:underline"
          >
            더보기
          </button>
        </div>
        {logs.filter(l => l.cat_id === currentCatId && l.log_type === 'ACTIVITY').length > 0 ? (
          <div className="space-y-2">
            {logs
              .filter(l => l.cat_id === currentCatId && l.log_type === 'ACTIVITY')
              .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime())
              .slice(0, 3)
              .map(log => (
                <Card
                  key={log.id}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform"
                  noPadding
                  onClick={() => setEditingLog(log)}
                >
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                    <PlayCircle size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-bold text-gray-400">{formatDate(log.visit_date)}</span>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{log.value}분</span>
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-1">{log.note || '신나는 사냥 놀이!'}</p>
                  </div>
                </Card>
              ))}
          </div>
        ) : (
          <div className="text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-400">아직 기록된 활동이 없어요.</p>
            <button
              onClick={() => setActiveLogType('ACTIVITY')}
              className="mt-2 text-xs font-bold text-primary hover:underline"
            >
              + 첫 놀이 기록하기
            </button>
          </div>
        )}
      </div>

      {/* Todo List */}
      <TodoList />

      {/* Health Tips / Contents */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">추천 건강 정보</h3>
          <button
            onClick={() => setShowAllTips(true)}
            className="text-xs text-primary font-bold hover:underline"
          >
            더보기
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6 snap-x">
          {healthTips.map(tip => (
            <div
              key={tip.id}
              onClick={() => setSelectedTip(tip)}
              className="min-w-[200px] snap-center cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-200 mb-2 group shadow-sm">
                <img src={tip.thumbnail_url} alt={tip.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                  {tip.category}
                </span>
              </div>
              <h4 className="font-bold text-sm text-gray-800 line-clamp-2 leading-tight">{tip.title}</h4>
            </div>
          ))}
          <div className="min-w-[20px] snap-center"></div>
        </div>
      </div>

      {/* Modals */}
      {activeLogType && (
        <HealthLogForm
          type={activeLogType}
          onClose={() => setActiveLogType(null)}
        />
      )}

      {isEditingProfile && (
        <CatEditForm onClose={() => setIsEditingProfile(false)} />
      )}

      {showHomeCheck && (
        <HomeCheckModal onClose={() => setShowHomeCheck(false)} />
      )}

      {showAppointmentModal && (
        <AppointmentModal
          onClose={() => {
            setShowAppointmentModal(false);
            setSelectedAppointment(null);
          }}
          initialData={selectedAppointment}
        />
      )}

      {showMedicationModal && (
        <MedicationModal
          onClose={() => {
            setShowMedicationModal(false);
            setSelectedMedication(null);
          }}
          initialData={selectedMedication}
        />
      )}

      {selectedTip && (
        <HealthTipDetail
          tip={selectedTip}
          onClose={() => setSelectedTip(null)}
        />
      )}

      {showAllTips && (
        <TipListModal
          onClose={() => setShowAllTips(false)}
          onSelectTip={(tip) => {
            setShowAllTips(false);
            setTimeout(() => setSelectedTip(tip), 200); // Smooth transition
          }}
        />
      )}

      {editingLog && (
        <HealthLogForm
          type={editingLog.log_type}
          initialData={editingLog}
          onClose={() => setEditingLog(null)}
        />
      )}

      {showLogList && (
        <LogListModal
          initialFilter={showLogList === 'ALL' ? undefined : showLogList}
          hideFilters={isLogListFocused}
          onClose={() => setShowLogList(null)}
        />
      )}

      {showAppointmentList && (
        <AppointmentListModal
          onClose={() => setShowAppointmentList(false)}
        />
      )}

      {showVaccineGuide && (
        <VaccineGuideModal onClose={() => setShowVaccineGuide(false)} />
      )}

    </div>
  );
};
