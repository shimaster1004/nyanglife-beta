import React from 'react';
import { X, Activity, AlertCircle, CheckCircle } from 'lucide-react';

interface StoolGuideModalProps {
    onClose: () => void;
}

export const StoolGuideModal: React.FC<StoolGuideModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-orange-500 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
                        <Activity size={24} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-black mb-1">고양이 대변 상태<br />체크 가이드</h2>
                    <p className="text-orange-100 text-sm font-medium">건강의 바로미터, 맛동산을 확인하세요!</p>
                </div>

                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xl shrink-0">👍</div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">정상 (맛동산)</h3>
                                <p className="text-sm text-gray-600 mt-1">촉촉하고 윤기가 흐르는 소시지 모양입니다. 집었을 때 형태가 유지되며 바닥에 묻어나지 않아요.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold text-xl shrink-0">💧</div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">무름 / 설사</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-bold text-yellow-600">무름:</span> 형태는 있지만 집으면 뭉개짐.<br />
                                    <span className="font-bold text-yellow-600">설사:</span> 형태 없이 퍼짐.<br />
                                    사료 교체, 과식, 스트레스, 기생충 감염 등이 원인일 수 있습니다.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-xl shrink-0">🪨</div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">딱딱함 (토끼똥)</h3>
                                <p className="text-sm text-gray-600 mt-1">수분이 없어 갈라지거나 작고 딱딱한 알갱이 형태입니다. 음수량 부족이나 변비가 원인입니다.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl shrink-0">🚨</div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">혈변 / 점액변</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-bold text-red-600">혈변:</span> 붉은 피가 섞여 있음 (항문/대장 출혈).<br />
                                    <span className="font-bold text-red-600">흑변:</span> 짜장면 색 (위/소장 출혈).<br />
                                    즉시 병원 방문이 필요합니다!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-2 text-gray-800 font-bold">
                            <CheckCircle size={18} className="text-blue-500" />
                            <span>체크 포인트</span>
                        </div>
                        <ul className="text-sm text-gray-600 leading-relaxed list-disc list-inside space-y-1">
                            <li>배변 횟수 (성묘 기준 1일 1~2회)</li>
                            <li>배변 시 통증 호소 여부</li>
                            <li>이물질(털, 기생충 등) 혼입 여부</li>
                        </ul>
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
