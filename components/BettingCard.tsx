import React, { useMemo } from 'react';
import { Plus, Check } from 'lucide-react';
import { Bet } from '../types';

interface BettingCardProps {
  bets: Bet[];
  selectedBets: Bet[];
  onToggleBet: (bet: Bet) => void;
}

const BettingCard: React.FC<BettingCardProps> = ({ bets, selectedBets, onToggleBet }) => {
  const isSelected = (id: string) => selectedBets.some(b => b.id === id);

  // Group bets by game
  const games = useMemo(() => {
    const grouped: Record<string, Bet[]> = {};
    bets.forEach(bet => {
      const gameKey = bet.game || 'Futures / Props';
      if (!grouped[gameKey]) {
        grouped[gameKey] = [];
      }
      grouped[gameKey].push(bet);
    });
    return grouped;
  }, [bets]);

  return (
    <div className="my-4 not-prose space-y-4">
      {Object.entries(games).map(([game, gameBets]) => (
        <div key={game} className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
          {/* Game Header */}
          <div className="bg-white/5 px-3 py-2 border-b border-white/5">
            <h4 className="text-xs font-bold text-juiced-300 uppercase tracking-wider">{game}</h4>
          </div>
          
          {/* Bets Grid */}
          <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {gameBets.map((bet) => {
              const selected = isSelected(bet.id);
              
              // Determine color for odds
              let oddsColor = 'text-white';
              if (selected) {
                oddsColor = 'text-juiced-neon';
              } else if (bet.odds.includes('+')) {
                oddsColor = 'text-juiced-400'; // Green for positive
              } else if (bet.odds.includes('-')) {
                oddsColor = 'text-red-400'; // Red for negative
              }

              return (
                <button
                  key={bet.id}
                  onClick={() => onToggleBet(bet)}
                  className={`
                    relative flex flex-col items-start p-3 rounded-lg border transition-all duration-200 group text-left
                    ${selected 
                      ? 'bg-juiced-neon/10 border-juiced-neon/50 shadow-[0_0_10px_rgba(57,255,20,0.15)]' 
                      : 'bg-transparent border-white/10 hover:border-juiced-neon/30 hover:bg-white/5'
                    }
                  `}
                >
                  <div className="flex justify-between w-full mb-1">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500">{bet.market}</span>
                  </div>
                  
                  <div className="flex justify-between w-full items-end gap-2">
                    <span className={`font-semibold text-sm leading-tight ${selected ? 'text-white' : 'text-gray-300'}`}>
                      {bet.selection}
                    </span>
                    <span className={`font-mono text-sm font-bold whitespace-nowrap ${oddsColor}`}>
                      {bet.odds}
                    </span>
                  </div>

                  {/* Selection Indicator */}
                  <div className={`absolute top-2 right-2 w-3 h-3 rounded-full flex items-center justify-center transition-colors ${
                    selected ? 'bg-juiced-neon text-black' : 'bg-white/10 text-gray-400 group-hover:bg-white/20'
                  }`}>
                    {selected ? <Check size={8} strokeWidth={4} /> : <Plus size={8} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BettingCard;