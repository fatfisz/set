export interface RoomState {
  cards: number[];
  remainingCardCount: number;
  scores: {
    sessionId: string;
    name: string;
    score: number;
  }[];
}
