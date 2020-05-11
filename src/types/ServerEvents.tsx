export interface ServerEvents {
  'room state changed': {
    cards: number[];
    names: Record<string, string>;
    options: {
      autoAddCard: boolean;
    };
    remainingCardCount: number;
    scores: {
      sessionId: string;
      name: string;
      score: number;
    }[];
  };
  'session id generated': string;
}
