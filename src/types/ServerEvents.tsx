export interface ServerEvents {
  'room state changed': {
    cards: number[];
    names: Record<string, string>;
    remainingCardCount: number;
    scores: {
      sessionId: string;
      name: string;
      score: number;
    }[];
  };
  'session id generated': string;
}
