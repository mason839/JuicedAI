import React from 'react';
import { User, Shield, CreditCard, Settings, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full h-full flex flex-col items-center">
      
      {/* Profile Card */}
      <div className="w-full bg-juiced-card border border-white/10 rounded-3xl overflow-hidden relative mb-8">
        <div className="h-32 bg-gradient-to-r from-juiced-900 to-black"></div>
        <div className="px-8 pb-8 flex flex-col items-center -mt-16">
          <div className="w-32 h-32 rounded-full bg-black p-1.5 border border-juiced-neon/30 shadow-2xl">
            <div className="w-full h-full rounded-full bg-juiced-800 flex items-center justify-center overflow-hidden">
               {/* Placeholder Avatar */}
               <User size={64} className="text-juiced-200" />
            </div>
          </div>
          
          <h2 className="mt-4 text-2xl font-display font-bold text-white">BigWagerBrad</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-juiced-neon text-black">PRO MEMBER</span>
            <span className="text-xs text-gray-500 font-mono">ID: #8829-XJ-22</span>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-8 w-full border-t border-white/5 pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">142</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Bets Placed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-juiced-400">58%</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Active Parlays</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="w-full space-y-2">
        <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Shield size={20} />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-gray-200">Account Security</div>
            <div className="text-xs text-gray-500">2FA, Password, Login History</div>
          </div>
        </button>

        <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CreditCard size={20} />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-gray-200">Billing & Subscription</div>
            <div className="text-xs text-gray-500">Manage payment methods</div>
          </div>
        </button>

        <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
          <div className="w-10 h-10 rounded-full bg-gray-500/10 text-gray-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Settings size={20} />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-gray-200">Preferences</div>
            <div className="text-xs text-gray-500">Odds format, Notifications</div>
          </div>
        </button>

        <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20 group mt-4">
          <div className="w-10 h-10 rounded-full bg-transparent text-gray-500 group-hover:text-red-500 flex items-center justify-center">
            <LogOut size={20} />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-gray-500 group-hover:text-red-500">Sign Out</div>
          </div>
        </button>
      </div>

    </div>
  );
};

export default Profile;
