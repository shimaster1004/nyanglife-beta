
import React, { useState, useRef } from 'react';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Camera, Search, Sparkles, AlertCircle } from 'lucide-react';
import { BreedSelector } from './BreedSelector';
import { getBreedInfo } from '../lib/breeds';

export const CatSetup: React.FC<{ onComplete: () => void, onCancel?: () => void }> = ({ onComplete, onCancel }) => {
    const { addCat, user } = useStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showBreedSelector, setShowBreedSelector] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        birth_date: '',
        weight_kg: '',
        gender: 'M',
        is_neutered: false,
        image_url: '',
        breed_code: ''
    });

    const selectedBreed = getBreedInfo(formData.breed_code);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        const success = await addCat({
            name: formData.name,
            birth_date: formData.birth_date,
            weight_kg: Number(formData.weight_kg),
            gender: formData.gender as 'M' | 'F',
            is_neutered: formData.is_neutered,
            image_url: formData.image_url || `https://picsum.photos/seed/${formData.name}/200`,
            breed_code: formData.breed_code
        });

        setIsSubmitting(false);

        if (success) {
            onComplete();
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

    return (
        <div className="p-6 min-h-[100dvh] flex flex-col pt-10 pb-40 relative">
            {onCancel && (
                <button
                    onClick={onCancel}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 font-bold text-sm"
                >
                    취소
                </button>
            )}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black text-gray-800 mb-2">반가워요! <br /><span className="text-primary">집사님</span> 👋</h1>
                <p className="text-gray-500">모실 고양이님을 소개해 주세요.</p>
                {/* Admin Bypass */}
                {user?.is_admin && (
                    <button
                        onClick={() => useStore.setState({ cats: [{ id: 'admin-bypass', name: 'Admin', user_id: 'admin', birth_date: '2000-01-01', gender: 'M', is_neutered: true, weight_kg: 0 }] as any })}
                        className="mt-4 text-xs text-gray-400 underline"
                    >
                        관리자 모드로 건너뛰기
                    </button>
                )}
            </div>

            <Card className="mb-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Photo Upload */}
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div
                            className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden relative group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {formData.image_url ? (
                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Camera size={24} />
                            )}
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" size={24} />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <span className="text-xs text-gray-400">프로필 사진 등록</span>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">이름</label>
                        <input
                            required
                            type="text"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="ex) 치즈"
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
                            <label className="block text-sm font-bold text-gray-700 mb-1">생일 (추정)</label>
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
                                placeholder="0.0"
                                value={formData.weight_kg}
                                onChange={e => setFormData({ ...formData, weight_kg: e.target.value })}
                            />
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

                    <Button type="submit" className="w-full h-12 text-lg shadow-lg shadow-orange-200 mt-4" isLoading={isSubmitting}>
                        등록하고 시작하기
                    </Button>
                </form>
            </Card>

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
