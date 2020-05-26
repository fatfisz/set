import { LobbyState } from 'shared/types/LobbyState';
import { RoomOptions } from 'shared/types/RoomOptions';
import { RoomState } from 'shared/types/RoomState';
import { SessionState } from 'shared/types/SessionState';

export interface ServerEvents {
  emitted: {
    'lobby state changed': [[LobbyState], void];
    'room state changed': [[RoomState], void];
    'server ready': [[], void];
    'session estabilished': [[SessionState], string];
    disconnect: [[string], void];
  };
  received: {
    'add next card': [[], void];
    'create room': [[RoomOptions], void];
    'finish game': [[], void];
    'join room': [[string], boolean];
    'leave room': [[], void];
    'select set': [[number[]], void];
    'set name': [[string], void];
    disconnect: [[string], void];
  };
}
