
import React, { useState, useRef } from 'react';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { X, Camera, Trash2, AlertTriangle, HelpCircle, Image as ImageIcon, Search, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { BreedSelector } from './BreedSelector';
import { getBreedInfo } from '../lib/breeds';

interface CatEditFormProps {
    onClose: () => void;
}

export const CatEditForm: React.FC<CatEditFormProps> = ({ onClose }) => {
    const { cats, currentCatId, updateCat, deleteCat, isLoading } = useStore();
    const currentCat = cats.find(c => c.id === currentCatId);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showBCSHelp, setShowBCSHelp] = useState(false);
    const [showBreedSelector, setShowBreedSelector] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize state with current cat data
    const [formData, setFormData] = useState({
        name: currentCat?.name || '',
        birth_date: currentCat?.birth_date || '',
        weight_kg: currentCat?.weight_kg || '',
        gender: currentCat?.gender || 'M',
        is_neutered: currentCat?.is_neutered || false,
        image_url: currentCat?.image_url || '',
        bcs: currentCat?.bcs || 5,
        breed_code: currentCat?.breed_code || '',
    });

    const selectedBreed = getBreedInfo(formData.breed_code);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCatId) return;

        const success = await updateCat(currentCatId, {
            name: formData.name,
            birth_date: formData.birth_date,
            weight_kg: Number(formData.weight_kg),
            gender: formData.gender as 'M' | 'F',
            is_neutered: formData.is_neutered,
            image_url: formData.image_url,
            bcs: formData.bcs,
            breed_code: formData.breed_code,
        });

        if (success) {
            onClose();
        }
    };

    const handleDelete = () => {
        if (currentCatId) {
            deleteCat(currentCatId);
            onClose();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit
                alert("이미지 크기는 1MB 이하여야 합니다.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image_url: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const getBCSDescription = (score: number) => {
        if (score <= 3) return { text: "마름 (갈비뼈가 쉽게 만져짐)", color: "text-blue-500", bg: "bg-blue-50" };
        if (score === 4) return { text: "약간 마름 (허리가 잘록함)", color: "text-blue-400", bg: "bg-blue-50" };
        if (score === 5) return { text: "이상적인 체형", color: "text-green-600", bg: "bg-green-50" };
        if (score === 6) return { text: "과체중 (허리 라인이 불분명)", color: "text-orange-500", bg: "bg-orange-50" };
        if (score >= 7) return { text: "비만 (갈비뼈가 잘 안 만져짐)", color: "text-red-500", bg: "bg-red-50" };
        return { text: "선택해주세요", color: "text-gray-500", bg: "bg-gray-50" };
    };

    const bcsInfo = getBCSDescription(formData.bcs);

    if (!currentCat) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">

            {/* Confirmation Modal Overlay */}
            {showDeleteConfirm && (
                <div
                    className="absolute inset-0 z-[120] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200"
                    onClick={() => setShowDeleteConfirm(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="text-red-500" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">정말 삭제하시겠습니까?</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                <span className="font-bold text-gray-800">{currentCat.name}</span>의 모든 데이터가 삭제되며<br />복구할 수 없습니다.
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 transition-colors"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Form */}
            <div className={`w-full max-w-md bg-white rounded-t-3xl h-[85vh] flex flex-col shadow-xl animate-in slide-in-from-bottom duration-300 transition-all ${showDeleteConfirm ? 'scale-95 opacity-50 blur-[1px]' : ''}`}>
                <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">고양이 정보 수정</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 pb-40">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Image Profile Section */}
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="relative">
                                <div
                                    className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer group relative"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <img
                                        src={formData.image_url || 'https://picsum.photos/200'}
                                        alt={formData.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full hover:bg-black transition-colors shadow-md z-10"
                                >
                                    <Camera size={14} />
                                </button>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />

                            <div className="w-full px-4">
                                <div className="relative">
                                    <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="또는 이미지 URL 직접 입력"
                                        className="w-full text-xs text-center text-gray-600 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:border-primary/50 rounded-lg py-2 pl-8 pr-2 transition-all outline-none"
                                        value={formData.image_url}
                                        onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">이름</label>
                            <input
                                required
                                type="text"
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Breed Selection */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">품종</label>
                            <button
                                type="button"
                                onClick={() => setShowBreedSelector(true)}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <span className={formData.breed_code ? "text-gray-900 font-medium" : "text-gray-400"}>
                                    {selectedBreed ? selectedBreed.name : "품종을 선택해주세요"}
                                </span>
                                <Search size={18} className="text-gray-400" />
                            </button>

                            {/* Breed Info Card */}
                            {selectedBreed && (
                                <div className="mt-3 bg-orange-50 border border-orange-100 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-start gap-2 mb-2">
                                        <Sparkles size={16} className="text-primary mt-0.5" />
                                        <p className="text-xs text-orange-800 font-medium leading-relaxed">
                                            <span className="font-bold">성격:</span> {selectedBreed.personality}
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <AlertCircle size={16} className="text-red-400 mt-0.5" />
                                        <p className="text-xs text-gray-600 font-medium leading-relaxed">
                                            <span className="font-bold text-gray-700">건강 체크:</span> {selectedBreed.health_issue}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">생일</label>
                                <input
                                    required
                                    type="date"
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    value={formData.birth_date}
                                    onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">몸무게 (kg)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.1"
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    value={formData.weight_kg}
                                    onChange={e => setFormData({ ...formData, weight_kg: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* BCS Selector UI */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <label className="block text-sm font-bold text-gray-700">BCS (신체충실지수)</label>
                                <button
                                    type="button"
                                    onClick={() => setShowBCSHelp(!showBCSHelp)}
                                    className="text-gray-400 hover:text-primary transition-colors focus:outline-none"
                                    aria-label="BCS 도움말 보기"
                                >
                                    <HelpCircle size={18} />
                                </button>
                            </div>

                            {showBCSHelp && (
                                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-xs text-gray-600 mb-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <p className="flex items-start gap-2">
                                        <span className="font-bold text-blue-500 shrink-0">1-3단계 (마름):</span>
                                        <span>갈비뼈가 눈에 보이거나 만졌을 때 지방 없이 바로 느껴져요.</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="font-bold text-green-600 shrink-0">4-5단계 (이상적):</span>
                                        <span>갈비뼈가 눈에 보이지 않지만, 만지면 적당한 지방 아래로 느껴져요.</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="font-bold text-red-500 shrink-0">6-9단계 (비만):</span>
                                        <span>갈비뼈를 만지기 어렵거나, 배가 쳐지고 허리 라인이 없어요.</span>
                                    </p>
                                </div>
                            )}

                            <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex justify-between gap-1 mb-3">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((score) => (
                                        <button
                                            key={score}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, bcs: score })}
                                            className={cn(
                                                "flex-1 aspect-[4/5] rounded-lg text-sm font-bold transition-all flex flex-col items-center justify-center border-2",
                                                formData.bcs === score
                                                    ? "border-primary bg-primary text-white shadow-md scale-110 z-10"
                                                    : "border-transparent bg-white text-gray-400 hover:bg-gray-100"
                                            )}
                                        >
                                            {score}
                                        </button>
                                    ))}
                                </div>
                                <div className={cn("text-center p-2 rounded-lg text-sm font-bold transition-colors", bcsInfo.bg, bcsInfo.color)}>
                                    {bcsInfo.text}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">성별</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: 'M' })}
                                    className={`flex-1 py-3 rounded-xl border font-medium transition-all ${formData.gender === 'M' ? 'border-primary bg-orange-50 text-primary' : 'border-gray-200 text-gray-400'}`}
                                >
                                    남아 ♂
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: 'F' })}
                                    className={`flex-1 py-3 rounded-xl border font-medium transition-all ${formData.gender === 'F' ? 'border-primary bg-orange-50 text-primary' : 'border-gray-200 text-gray-400'}`}
                                >
                                    여아 ♀
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer" onClick={() => setFormData({ ...formData, is_neutered: !formData.is_neutered })}>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.is_neutered ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
                                {formData.is_neutered && <span className="text-white text-xs">✓</span>}
                            </div>
                            <label className="text-sm font-medium text-gray-700 cursor-pointer pointer-events-none">중성화 수술을 했어요</label>
                        </div>

                        <Button type="submit" className="w-full h-12 text-lg shadow-lg shadow-orange-200 mt-2" isLoading={isLoading}>
                            수정 완료
                        </Button>

                        <div className="mt-6 border-t border-gray-100 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="w-full flex items-center justify-center gap-2 text-red-500 py-3 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
                            >
                                <Trash2 size={16} />
                                고양이 삭제하기
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showBreedSelector && (
                <BreedSelector
                    onClose={() => setShowBreedSelector(false)}
                    selectedCode={formData.breed_code}
                    onSelect={(code) => {
                        setFormData({ ...formData, breed_code: code });
                        setShowBreedSelector(false);
                    }}
                />
            )}
        </div>
    );
};
