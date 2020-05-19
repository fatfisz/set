import { Session as ServerSession } from 'Session';
import { RoomOptions } from 'shared/types/RoomOptions';

type SessionId = ServerSession['id'];

export interface Players {
  sessions: SessionId[];
  scores: Record<SessionId, number>;
}

export interface Room {
  id: string;
  options: RoomOptions;
}

export interface Session {
  id: string;
  name: string;
}

export interface Table {
  cards: number[];
  nextCardIndex: number;
  tableCards: number[];
}
