export interface ServerEvents {
  emitted: {
    'room state changed': [
      {
        cards: number[];
        options: {
          autoAddCard: boolean;
        };
        remainingCardCount: number;
        scores: {
          sessionId: string;
          name: string;
          score: number;
        }[];
      }
    ];
    'session estabilished': [
      {
        id: string;
        name: string;
      }
    ];
  };
  received: {
    'add next card': [];
    'room joined': [];
    'name set': [string];
    'set selected': [number[]];
    'session id received': [string];
  };
}
