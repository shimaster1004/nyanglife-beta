import React from 'react';
import { X, Syringe, ShieldCheck, AlertCircle } from 'lucide-react';

interface VaccineGuideModalProps {
    onClose: () => void;
}

export const VaccineGuideModal: React.FC<VaccineGuideModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-orange-500 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                        <Syringe size={24} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-black mb-1">아기 고양이<br />필수 접종 가이드</h2>
                    <p className="text-orange-100 text-sm font-medium">건강한 묘생을 위한 첫 걸음!</p>
                </div>

                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">1차</div>
                                <div className="w-0.5 h-full bg-orange-100 my-1"></div>
                            </div>
                            <div className="pb-6">
                                <h3 className="font-bold text-gray-900">생후 8주 (2개월)</h3>
                                <p className="text-sm text-gray-600 mt-1">종합백신(FVRCP) 1차 접종을 진행합니다. 어미로부터 받은 면역력이 떨어지는 시기입니다.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">2차</div>
                                <div className="w-0.5 h-full bg-orange-100 my-1"></div>
                            </div>
                            <div className="pb-6">
                                <h3 className="font-bold text-gray-900">생후 12주 (3개월)</h3>
                                <p className="text-sm text-gray-600 mt-1">종합백신 2차 접종을 진행합니다. 1차 접종 후 3~4주 간격으로 진행합니다.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">3차</div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">생후 16주 (4개월)</h3>
                                <p className="text-sm text-gray-600 mt-1">종합백신 3차 접종과 광견병 접종을 진행합니다. 항체가 충분히 생성되었는지 항체가 검사를 권장합니다.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-2 text-gray-800 font-bold">
                            <ShieldCheck size={18} className="text-green-500" />
                            <span>이후 관리는요?</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            기초 접종이 완료된 후에는 <span className="font-bold text-gray-900">1년에 1회</span> 추가 접종을 통해 면역력을 유지해주는 것이 좋습니다.
                        </p>
                    </div>

                    <div className="flex items-start gap-2 bg-red-50 p-4 rounded-2xl text-red-600 text-xs leading-relaxed">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <p>접종 후에는 고양이가 스트레스를 받지 않도록 푹 쉬게 해주시고, 목욕이나 격한 운동은 피해주세요.</p>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                    >
                        확인했어요
                    </button>
                </div>
            </div>
        </div>
    );
};
