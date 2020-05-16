import { RoomState } from 'shared/types/RoomState';
import { SessionState } from 'shared/types/SessionState';

export interface ServerEvents {
  emitted: {
    'room state changed': [RoomState];
    'session estabilished': [SessionState];
  };
  received: {
    'add next card': [];
    'confirm session': [string];
    'join room': [];
    'select set': [number[]];
    'set name': [string];
  };
}
