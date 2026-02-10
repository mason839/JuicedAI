import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Trash2, StopCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { geminiService } from '../services/geminiService';
import { Message, Role, Bet, Parlay } from '../types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import BetSlip from './BetSlip';

interface ChatInterfaceProps {
  onPlaceParlay: (parlay: Parlay) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onPlaceParlay }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBets, setSelectedBets] = useState<Bet[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        id: 'init-1',
        role: Role.MODEL,
        text: "## Welcome to JuicedAI ⚡\n\nI'm your sports betting edge. I can check live odds, analyze player props, and give you the data you need to make sharper plays.\n\n**What are we looking at today?**",
        timestamp: Date.now(),
      }
    ]);
    geminiService.initializeChat();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: Role.USER,
      text: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const tempBotId = uuidv4();
    // Placeholder for streaming
    setMessages(prev => [...prev, {
      id: tempBotId,
      role: Role.MODEL,
      text: '',
      timestamp: Date.now(),
    }]);

    await geminiService.sendMessageStream(
      userMessage.text,
      (streamedText) => {
        setMessages(prev => prev.map(msg => 
          msg.id === tempBotId ? { ...msg, text: streamedText } : msg
        ));
      },
      (fullText, groundingChunks) => {
        setMessages(prev => prev.map(msg => 
          msg.id === tempBotId ? { ...msg, text: fullText, groundingChunks } : msg
        ));
        setIsLoading(false);
      },
      (error) => {
        setMessages(prev => prev.map(msg => 
          msg.id === tempBotId ? { ...msg, text: `**Error:** ${error.message}`, isError: true } : msg
        ));
        setIsLoading(false);
      }
    );
  };

  const handleToggleBet = (bet: Bet) => {
    setSelectedBets(prev => {
      const exists = prev.find(b => b.id === bet.id);
      if (exists) {
        return prev.filter(b => b.id !== bet.id);
      }
      return [...prev, bet];
    });
  };

  const handleRemoveBet = (betId: string) => {
    setSelectedBets(prev => prev.filter(b => b.id !== betId));
  };

  const handlePlaceBet = (wager: number, totalOdds: string, payout: number) => {
    const newParlay: Parlay = {
      id: uuidv4(),
      bets: [...selectedBets],
      wager: wager,
      totalOdds: totalOdds,
      potentialPayout: payout,
      date: Date.now(),
      status: 'pending'
    };
    
    onPlaceParlay(newParlay);
    setSelectedBets([]); // Clear slip after placement
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    geminiService.resetChat();
    setMessages([
      {
        id: uuidv4(),
        role: Role.MODEL,
        text: "Reset complete. Who's on the slate now?",
        timestamp: Date.now(),
      }
    ]);
    setSelectedBets([]);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-transparent relative">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth pt-20">
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            selectedBets={selectedBets}
            onToggleBet={handleToggleBet}
          />
        ))}
        {isLoading && messages[messages.length - 1].role === Role.USER && (
           <div className="flex w-full mb-6 justify-start">
             <div className="flex max-w-[80%] gap-3 flex-row">
               <div className="flex-shrink-0 h-8 w-8 rounded-full bg-juiced-dark border border-juiced-500/30 flex items-center justify-center">
                 <Zap size={16} className="text-juiced-neon animate-pulse" />
               </div>
               <TypingIndicator />
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 pb-6 bg-gradient-to-t from-black via-black to-transparent z-10">
        <div className="relative flex items-end gap-2 bg-juiced-card border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/50 focus-within:border-juiced-500/50 focus-within:ring-1 focus-within:ring-juiced-500/20 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about odds, props, or tonight's slate..."
            className="w-full bg-transparent text-gray-200 placeholder-gray-500 text-sm md:text-base p-3 min-h-[50px] max-h-[150px] resize-none focus:outline-none"
            rows={1}
            style={{ minHeight: '50px' }}
          />
          <button
            onClick={handleReset}
            className="p-3 text-gray-500 hover:text-red-400 transition-colors rounded-xl flex-shrink-0 bg-white/5 hover:bg-white/10 h-[50px] w-[50px] flex items-center justify-center"
            title="Reset Chat"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl flex-shrink-0 transition-all duration-200 h-[50px] w-[50px] flex items-center justify-center ${
              input.trim() && !isLoading
                ? 'bg-juiced-neon text-black hover:bg-juiced-400 shadow-[0_0_10px_rgba(57,255,20,0.4)]'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? <StopCircle size={20} className="animate-pulse" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-600 mt-3">
          JuicedAI can make mistakes. Always verify odds. Please gamble responsibly.
        </p>
      </div>

      {/* Bet Slip Overlay */}
      <BetSlip 
        selectedBets={selectedBets} 
        onRemoveBet={handleRemoveBet} 
        onClear={() => setSelectedBets([])}
        onPlaceBet={handlePlaceBet}
      />
    </div>
  );
};

export default ChatInterface;
