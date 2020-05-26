import { Session as ServerSession } from 'Session';
import { RoomOptions } from 'shared/types/RoomOptions';

type SessionId = ServerSession['id'];

export interface DatabaseSchema {
  room: {
    id: string;
    manuallyFinished: boolean;
    options: RoomOptions;
    players: {
      scores: Record<SessionId, number>;
    };
    table: {
      cards: number[];
      nextCardIndex: number;
      tableCards: number[];
    };
  };
  session: {
    id: string;
    name: string;
  };
}
