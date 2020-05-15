export interface RoomState {
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
