import React from 'react';
import { useStore } from '../store';
import { Button } from './ui/Button';
import { Sparkles, Activity, Calendar, Heart, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
    const { login, isLoading, loginWithEmail } = useStore();

    return (
        <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🐱</span>
                    <span className="font-black text-xl text-gray-900">NyangLife</span>
                </div>
                <div className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    BETA
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 relative">
                {/* Decorative Blobs */}
                <div className="absolute top-0 right-[-20%] w-[300px] h-[300px] bg-orange-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-[-20%] w-[300px] h-[300px] bg-pink-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="relative z-10 max-w-md mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles size={12} className="text-primary" />
                        <span>생애 주기별 맞춤 고양이 건강 관리 솔루션</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        우리 냥이의 <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">모든 순간</span>을 기록하세요
                    </h1>

                    <p className="text-gray-500 text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        체중 관리부터 병원 기록, 생애 주기별 맞춤 팁까지.<br />
                        냥라이프와 함께라면 집사 생활이 더 쉬워집니다.
                    </p>

                    <div className="pt-8 space-y-3 w-full animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                        <Button
                            onClick={login}
                            isLoading={isLoading}
                            className="w-full h-14 text-lg bg-[#FEE500] hover:bg-[#FDD835] text-black border-none shadow-lg shadow-yellow-200/50"
                        >
                            <span className="mr-2">💬</span> 카카오로 3초만에 시작
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-400">또는 이메일로 시작</span>
                            </div>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
                                if (email) loginWithEmail(email);
                            }}
                            className="space-y-2"
                        >
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="name@example.com"
                                    className="flex-1 h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50"
                                />
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    className="h-12 px-6"
                                >
                                    <ArrowRight size={20} />
                                </Button>
                            </div>
                        </form>

                        <div className="pt-4 text-center">
                            <button
                                onClick={() => useStore.getState().loginAsDemo()}
                                className="text-xs text-gray-300 underline hover:text-gray-500 transition-colors"
                            >
                                데모 계정으로 시작하기 (Admin)
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="px-6 py-16 bg-gray-50">
                <div className="max-w-md mx-auto space-y-12">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">왜 냥라이프인가요?</h2>
                        <p className="text-gray-500 text-sm">집사님들이 꼭 필요로 하는 기능만 담았습니다.</p>
                    </div>

                    <div className="grid gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">건강 기록 & 차트</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">몸무게, 음수량, 감자/맛동산 상태를 기록하고 그래프로 변화를 한눈에 확인하세요.</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500 shrink-0">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">생애 주기별 관리</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">아기 고양이부터 노령묘까지, 나이에 딱 맞는 케어 가이드와 알림을 제공합니다.</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 shrink-0">
                                <Heart size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">병원 & 접종 알림</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">잊기 쉬운 예방접종일과 정기검진 일정을 놓치지 않도록 미리 알려드려요.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof / Trust */}
            <section className="px-6 py-12 bg-white text-center">
                <div className="max-w-md mx-auto">
                    <div className="flex justify-center items-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Sparkles key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                        ))}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">"초보 집사에게 필수 앱이에요!"</h3>
                    <p className="text-gray-500 text-sm">베타 테스터 1,000명이 선택한<br />가장 쉬운 고양이 관리 앱</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 py-8 bg-gray-50 text-center text-xs text-gray-400 border-t border-gray-100">
                <p className="mb-2">© 2024 NyangLife. All rights reserved.</p>
                <div className="flex justify-center gap-4">
                    <a href="#" className="hover:text-gray-600">이용약관</a>
                    <a href="#" className="hover:text-gray-600">개인정보처리방침</a>
                    <a href="#" className="hover:text-gray-600">문의하기</a>
                </div>
            </footer>
        </div>
    );
};
