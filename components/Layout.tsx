import React from 'react';
import { useStore } from '../store';
import { Home, ClipboardList, User, PlusCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'logs' | 'profile';
  onTabChange: (tab: 'home' | 'logs' | 'profile') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen bg-background text-gray-900 font-sans pb-24 md:pb-0 relative flex justify-center">
      {/* Mobile constrained container */}
      <div className="w-full max-w-md bg-background min-h-screen flex flex-col relative shadow-2xl">

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {children}
        </main>

        {/* Sticky Bottom Nav (Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex justify-between items-center pointer-events-auto pb-6">
            <button
              onClick={() => onTabChange('home')}
              className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-primary' : 'text-gray-400'}`}
            >
              <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
              <span className="text-[10px] font-medium">홈</span>
            </button>

            {/* Floating Action Button - Link to Logs/Report */}
            <div className="-mt-8">
              <button
                onClick={() => onTabChange('logs')}
                className={`p-4 rounded-full shadow-lg shadow-orange-200 hover:scale-105 transition-transform ${activeTab === 'logs' ? 'bg-gray-800 text-white' : 'bg-primary text-white'}`}
              >
                <ClipboardList size={28} />
              </button>
            </div>

            <button
              onClick={() => onTabChange('profile')}
              className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-primary' : 'text-gray-400'}`}
            >
              <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
              <span className="text-[10px] font-medium">프로필</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};