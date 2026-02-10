import React from 'react';
import { Parlay } from '../types';
import { Ticket, Calendar, DollarSign, Trophy } from 'lucide-react';

interface MyParlaysProps {
  parlays: Parlay[];
}

const MyParlays: React.FC<MyParlaysProps> = ({ parlays }) => {
  if (parlays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
          <Ticket size={32} className="opacity-50" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Bets Placed Yet</h3>
        <p className="max-w-xs text-sm">Build a parlay in the chat using JuicedAI to see your slips here.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto w-full">
      <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
        <Ticket className="text-juiced-neon" /> My Parlays
      </h2>
      
      <div className="space-y-4">
        {parlays.map((parlay) => (
          <div key={parlay.id} className="bg-juiced-card border border-white/10 rounded-2xl overflow-hidden hover:border-juiced-500/30 transition-all">
            {/* Ticket Header */}
            <div className="bg-white/5 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${parlay.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                  {parlay.status === 'pending' ? <Calendar size={18} /> : <Trophy size={18} />}
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    {new Date(parlay.date).toLocaleDateString()} • {new Date(parlay.date).toLocaleTimeString()}
                  </div>
                  <div className="font-mono text-sm font-bold text-white tracking-wider">
                    ID: {parlay.id.slice(0, 8).toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Wager</div>
                  <div className="text-white font-bold">${parlay.wager.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Total Odds</div>
                  <div className="text-juiced-neon font-mono font-bold">{parlay.totalOdds}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">To Win</div>
                  <div className="text-white font-bold text-lg">${(parlay.potentialPayout - parlay.wager).toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Legs */}
            <div className="p-4 bg-black/20">
              <div className="space-y-2">
                {parlay.bets.map((bet) => (
                  <div key={bet.id} className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-1.5 h-1.5 rounded-full bg-juiced-500 flex-shrink-0"></div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-gray-200 truncate">{bet.selection}</span>
                        <span className="text-[10px] text-gray-500 truncate">{bet.game} • {bet.market}</span>
                      </div>
                    </div>
                    <div className="font-mono text-xs font-bold text-gray-400">
                      {bet.odds}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyParlays;
