import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';
import { Message, Role, Bet } from '../types';
import GroundingSources from './GroundingSources';
import BettingCard from './BettingCard';

interface MessageBubbleProps {
  message: Message;
  selectedBets: Bet[];
  onToggleBet: (bet: Bet) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, selectedBets, onToggleBet }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] lg:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'bg-juiced-600' : 'bg-juiced-dark border border-juiced-500/30'}`}>
          {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-juiced-neon" />}
        </div>

        {/* Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full overflow-hidden`}>
          <div className={`px-5 py-3.5 rounded-2xl shadow-sm w-full ${
            isUser 
              ? 'bg-juiced-600 text-white rounded-tr-sm' 
              : 'bg-juiced-card border border-white/10 text-gray-200 rounded-tl-sm'
          }`}>
            <div className={`prose prose-invert prose-sm max-w-none ${isUser ? 'text-white' : ''} 
              prose-headings:text-juiced-200 prose-a:text-juiced-400 prose-strong:text-juiced-neon
              prose-table:border-collapse prose-th:bg-white/5 prose-th:p-2 prose-td:p-2 prose-td:border-t prose-td:border-white/10
            `}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isBets = match && match[1] === 'bets';
                    
                    if (isBets) {
                      try {
                        const content = String(children).replace(/\n$/, '');
                        // Attempt to fix common JSON streaming issues if cut off? 
                        // For now, simple parse. If streaming catches it mid-flight, it might error, 
                        // but re-render on next chunk fixes it.
                        const betsData = JSON.parse(content);
                        if (Array.isArray(betsData)) {
                          return (
                            <BettingCard 
                              bets={betsData} 
                              selectedBets={selectedBets} 
                              onToggleBet={onToggleBet} 
                            />
                          );
                        }
                      } catch (e) {
                        // While streaming, JSON might be invalid. 
                        // Render a skeleton or just the partial text hidden?
                        // Return a subtle loading state.
                        return (
                          <div className="flex items-center gap-2 py-2 text-juiced-500/50 text-xs font-mono animate-pulse">
                            <div className="w-2 h-2 bg-juiced-500/50 rounded-full"></div>
                            Loading Live Lines...
                          </div>
                        );
                      }
                    }

                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
            
            {/* Grounding Sources (Only for Model) */}
            {!isUser && message.groundingChunks && message.groundingChunks.length > 0 && (
              <GroundingSources chunks={message.groundingChunks} />
            )}
          </div>
          
          <span className="text-[10px] text-gray-500 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
