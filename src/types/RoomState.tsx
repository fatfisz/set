export interface ServerRoomState {
  cards: number[];
  names: Record<string, string>;
  remainingCardCount: number;
  scores: {
    sessionId: string;
    name: string;
    score: number;
  }[];
}

export interface RoomState {
  cards: number[];
  remainingCardCount: number;
  scores: {
    sessionId: string;
    name: string;
    score: number;
  }[];
}
