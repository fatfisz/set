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
    'confirm session': [string];
    'join room': [];
    'select set': [number[]];
    'set name': [string];
  };
}
