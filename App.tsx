
import React, { useState, useEffect } from 'react';
import { useStore } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CatSetup } from './components/CatSetup';
import { Button } from './components/ui/Button';
import { AdminView } from './components/admin/AdminView';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { LogListModal } from './components/LogListModal';

// Simple Hash Router Implementation for SPA
const App: React.FC = () => {
  const { user, login, logout, cats, currentCatId, setCurrentCat, isLoading, loadInitialData } = useStore();
  const [activeTab, setActiveTab] = useState<'home' | 'logs' | 'profile'>('home');
  const [view, setView] = useState<'AUTH' | 'SETUP' | 'APP' | 'ADMIN'>('AUTH');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (isLoading) return; // Don't change view while loading

    if (user) {
      if (cats.length === 0) {
        setView('SETUP');
      } else {
        setView('APP');
      }
    } else {
      setView('AUTH');
    }
  }, [user, cats, isLoading]);

  const handleSetupComplete = () => {
    setView('APP');
  };

  // 1. Auth View
  if (view === 'AUTH') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        {/* Decorative Background Blobs */}
        <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-orange-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[300px] h-[300px] bg-pink-200 rounded-full blur-3xl opacity-30"></div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm w-full">
          <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-xl shadow-orange-200 mb-4 rotate-3">
            <span className="text-5xl">🐱</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">NyangLife</h1>
            <p className="text-gray-500 font-medium">고양이 생애 주기 관리 솔루션</p>
            <div className="inline-block mt-2 bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
              BETA VER 1.0
            </div>
          </div>

          <div className="w-full pt-8 space-y-3">
            <Button
              onClick={login}
              isLoading={isLoading}
              className="w-full h-14 text-lg bg-[#FEE500] hover:bg-[#FDD835] text-black border-none"
            >
              카카오로 3초만에 시작
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-gray-400">또는 이메일로 시작</span>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
                if (email) useStore.getState().loginWithEmail(email);
              }}
              className="space-y-2"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                className="w-full h-14 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
              />
              <Button
                type="submit"
                isLoading={isLoading}
                variant="outline"
                className="w-full h-14 text-lg bg-white"
              >
                이메일로 인증 링크 받기
              </Button>
            </form>
          </div>
          <p className="text-xs text-gray-400 mt-8">
            계속 진행함으로써 서비스 이용약관 및 개인정보 처리방침에 동의합니다.
          </p>
        </div>
      </div>
    );
  }

  // 2. Setup View (Onboarding)
  if (view === 'SETUP') {
    return <CatSetup
      onComplete={handleSetupComplete}
      onCancel={cats.length > 0 ? () => setView('APP') : undefined}
    />;
  }

  // 3. Admin View
  if (view === 'ADMIN') {
    return <AdminView onExit={() => setView('APP')} />;
  }

  // 4. Main App View
  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'home' && <Dashboard onAddCat={() => setView('SETUP')} />}
      {activeTab === 'logs' && (
        <LogListModal
          onClose={() => setActiveTab('home')}
          initialFilter="REPORT"
        />
      )}
      {activeTab === 'profile' && (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">설정</h1>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-xl font-bold">
                {user?.email[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-lg">{user?.email.split('@')[0]}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold bg-gradient-to-r from-orange-400 to-pink-500 text-white px-2 py-0.5 rounded-full">
                    BETA MEMBER
                  </span>
                  <span className="text-xs text-gray-400">무제한 이용 중</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm text-gray-500 mb-2">내 고양이 관리</p>

              <div className="space-y-2 mb-3">
                {cats.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setCurrentCat(cat.id);
                      setActiveTab('home');
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${cat.id === currentCatId ? 'border-primary bg-orange-50 ring-1 ring-primary' : 'border-gray-100 hover:bg-gray-50'}`}
                  >
                    <img src={cat.image_url || 'https://picsum.photos/200'} alt={cat.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-sm">{cat.name}</h4>
                      <p className="text-xs text-gray-500">{cat.gender === 'M' ? '남아' : '여아'} · {cat.weight_kg}kg</p>
                    </div>
                    {cat.id === currentCatId && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setView('SETUP')}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors font-medium"
              >
                + 새로운 고양이 등록하기
              </button>
            </div>

            {user?.is_admin && (
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => setView('ADMIN')}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                >
                  <ShieldCheck size={18} />
                  관리자 모드 전환
                </button>
              </div>
            )}

            <div className="pt-4">
              <Button variant="outline" className="w-full border-gray-200" onClick={logout}>로그아웃</Button>
              <p className="text-center text-[10px] text-gray-300 mt-4">Version 1.0.0 (Beta)</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
