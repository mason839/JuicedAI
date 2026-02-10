import React, { useState } from 'react';
import { Zap, Ticket, User } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import MyParlays from './components/MyParlays';
import Profile from './components/Profile';
import { Parlay } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'parlays' | 'profile'>('chat');
  const [parlays, setParlays] = useState<Parlay[]>([]);

  const handlePlaceParlay = (parlay: Parlay) => {
    setParlays(prev => [parlay, ...prev]);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col font-sans selection:bg-juiced-neon/30 selection:text-juiced-neon">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-juiced-900/20 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-juiced-900/20 rounded-full blur-[120px] opacity-40"></div>
      </div>
      
      {/* Header & Navigation */}
      <div className="relative z-50 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
             {/* Logo / Brand */}
             <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-juiced-neon/10 border border-juiced-neon/50 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                <Zap size={18} className="text-juiced-neon fill-juiced-neon" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl tracking-tight text-white hidden sm:block">
                  Juiced<span className="text-juiced-neon">AI</span>
                </h1>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-white/5 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'chat' 
                    ? 'bg-juiced-neon text-black shadow-lg shadow-juiced-neon/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Zap size={16} className={activeTab === 'chat' ? 'fill-black' : ''} />
                <span className="hidden sm:inline">JuicedAI</span>
              </button>
              <button
                onClick={() => setActiveTab('parlays')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'parlays' 
                    ? 'bg-juiced-neon text-black shadow-lg shadow-juiced-neon/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Ticket size={16} className={activeTab === 'parlays' ? 'fill-black' : ''} />
                <span className="hidden sm:inline">My Parlays</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'profile' 
                    ? 'bg-juiced-neon text-black shadow-lg shadow-juiced-neon/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <User size={16} className={activeTab === 'profile' ? 'fill-black' : ''} />
                <span className="hidden sm:inline">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Chat Tab - Always Mounted to preserve state, just hidden */}
        <div className={`flex-1 h-full flex flex-col ${activeTab === 'chat' ? 'flex' : 'hidden'}`}>
          <ChatInterface onPlaceParlay={handlePlaceParlay} />
        </div>

        {/* Parlays Tab */}
        {activeTab === 'parlays' && (
          <div className="flex-1 h-full overflow-y-auto">
             <MyParlays parlays={parlays} />
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="flex-1 h-full overflow-y-auto">
             <Profile />
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
