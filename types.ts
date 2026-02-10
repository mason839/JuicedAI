export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface Bet {
  id: string;
  selection: string;
  odds: string;
  market: string;
  game?: string;
}

export interface Parlay {
  id: string;
  bets: Bet[];
  wager: number;
  totalOdds: string;
  potentialPayout: number;
  date: number;
  status: 'pending' | 'won' | 'lost';
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  groundingChunks?: GroundingChunk[];
  isError?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}
