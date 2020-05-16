import { LobbyState } from 'shared/types/LobbyState';
import { RoomOptions } from 'shared/types/RoomOptions';
import { RoomState } from 'shared/types/RoomState';
import { SessionState } from 'shared/types/SessionState';

export interface ServerEvents {
  emitted: {
    'lobby state changed': [LobbyState];
    'room state changed': [RoomState];
    'session estabilished': [SessionState];
  };
  received: {
    'add next card': [];
    'create room': [RoomOptions];
    'confirm session': [string];
    'join room': [string];
    'leave room': [];
    'select set': [number[]];
    'set name': [string];
  };
}
