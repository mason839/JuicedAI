import React, { useState, useMemo } from 'react';
import { Trash2, ChevronUp, ChevronDown, ArrowRight, DollarSign } from 'lucide-react';
import { Bet } from '../types';

interface BetSlipProps {
  selectedBets: Bet[];
  onRemoveBet: (betId: string) => void;
  onClear: () => void;
  onPlaceBet: (wager: number, totalOdds: string, payout: number) => void;
}

const BetSlip: React.FC<BetSlipProps> = ({ selectedBets, onRemoveBet, onClear, onPlaceBet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wager, setWager] = useState<string>('10');
  const [exitingItems, setExitingItems] = useState<Set<string>>(new Set());

  // Helper to convert American odds to decimal
  const getDecimalOdds = (american: string): number => {
    const odds = parseInt(american, 10);
    if (isNaN(odds)) return 1;
    if (odds > 0) return (odds / 100) + 1;
    return (100 / Math.abs(odds)) + 1;
  };

  // Convert decimal back to American
  const getAmericanOdds = (decimal: number): string => {
    if (decimal === 1) return "+0";
    if (decimal >= 2) {
      return "+" + Math.round((decimal - 1) * 100).toString();
    } else {
      return "-" + Math.round(100 / (decimal - 1)).toString();
    }
  };

  const parlayDecimal = useMemo(() => {
    if (selectedBets.length === 0) return 1;
    return selectedBets.reduce((acc, bet) => acc * getDecimalOdds(bet.odds), 1);
  }, [selectedBets]);

  const parlayOdds = useMemo(() => {
    return getAmericanOdds(parlayDecimal);
  }, [parlayDecimal]);

  const potentialPayout = useMemo(() => {
    const wagerNum = parseFloat(wager);
    if (isNaN(wagerNum) || wagerNum <= 0) return 0;
    return wagerNum * parlayDecimal;
  }, [wager, parlayDecimal]);

  const handlePlaceBet = () => {
    const wagerNum = parseFloat(wager);
    if (isNaN(wagerNum) || wagerNum <= 0) return;
    onPlaceBet(wagerNum, parlayOdds, potentialPayout);
    setIsOpen(false);
  };

  const handleRemoveBet = (id: string) => {
    setExitingItems(prev => new Set(prev).add(id));
    setTimeout(() => {
      onRemoveBet(id);
      setExitingItems(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 200); // Matches animation duration in tailwind config
  };

  if (selectedBets.length === 0) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 w-[95%] md:w-80 transition-all duration-300 ease-in-out transform ${isOpen ? 'translate-y-0' : 'translate-y-0'}`}>
      <div className="bg-juiced-card border border-juiced-neon/30 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[600px]">
        
        {/* Header (Always Visible) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-juiced-900/90 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/5 w-full hover:bg-juiced-900 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className={`bg-juiced-neon text-black font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg shadow-juiced-neon/20 transition-transform duration-300 ${selectedBets.length > 0 ? 'scale-100' : 'scale-0'}`}>
              {selectedBets.length}
            </div>
            <span className="font-display font-bold text-white tracking-wide">Bet Slip</span>
          </div>
          <div className="flex items-center gap-2 text-juiced-100">
            {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </div>
        </button>

        {/* Content (Collapsible) */}
        <div className={`bg-black/90 backdrop-blur-xl transition-all duration-300 overflow-y-auto ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-4 space-y-3">
            {selectedBets.map((bet) => (
              <div 
                key={bet.id} 
                className={`bg-white/5 rounded-lg p-3 flex justify-between items-center group hover:bg-white/10 border border-transparent hover:border-white/10 transition-all ${exitingItems.has(bet.id) ? 'animate-exit' : 'animate-enter'}`}
              >
                <div className="overflow-hidden">
                  <div className="text-xs text-juiced-300 font-medium mb-0.5 truncate">{bet.selection}</div>
                  <div className="text-[10px] text-gray-500 flex items-center gap-2">
                    <span className="truncate max-w-[80px]">{bet.market}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full flex-shrink-0"></span>
                    <span className="truncate max-w-[100px]">{bet.game}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-mono text-xs font-bold text-white bg-white/10 px-1.5 py-0.5 rounded">{bet.odds}</span>
                  <button 
                    onClick={() => handleRemoveBet(bet.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Calculations & Wager */}
          <div className="p-4 bg-white/5 border-t border-white/5 space-y-4">
            
            {/* Odds Display */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Parlay Odds</span>
              <span className="text-juiced-neon font-display font-bold text-lg animate-enter key-[parlayOdds]">
                {parlayOdds}
              </span>
            </div>

            {/* Wager Input */}
            <div className="bg-black/40 rounded-lg p-2 border border-white/10 flex items-center gap-2 focus-within:border-juiced-500/50 transition-colors">
              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-gray-400">
                <DollarSign size={16} />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-gray-500 block leading-none mb-1 uppercase tracking-wider">Wager</label>
                <input 
                  type="number" 
                  value={wager}
                  onChange={(e) => setWager(e.target.value)}
                  className="bg-transparent w-full text-white font-mono text-sm focus:outline-none placeholder-gray-700"
                  placeholder="0.00"
                  min="0"
                />
              </div>
            </div>

            {/* Potential Payout */}
            <div className="flex justify-between items-end">
              <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">To Win</span>
              <span className="text-white font-display font-bold text-xl tracking-tight">
                ${(potentialPayout - parseFloat(wager || '0')).toFixed(2)}
              </span>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button 
                onClick={onClear}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                Clear
              </button>
              <button 
                onClick={handlePlaceBet}
                className="flex-1 bg-juiced-neon text-black font-bold py-3 rounded-lg text-sm hover:bg-juiced-400 transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)] flex items-center justify-center gap-2"
              >
                Place Bet <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetSlip;