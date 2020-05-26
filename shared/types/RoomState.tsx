export interface RoomState {
  cards: number[];
  isFinished: boolean;
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
