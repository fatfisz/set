import { ContextType, createContext, ReactNode, useState } from 'react';

import { storageIdKey } from 'config/storage';
import {
  useSocket,
  useSocketEmitter,
  useSocketListener,
} from 'hooks/useSocket';
import { LobbyState } from 'shared/types/LobbyState';
import { RoomOptions } from 'shared/types/RoomOptions';
import { RoomState } from 'shared/types/RoomState';

export const SocketContext = createContext<{
  name: string;
  currentSessionId: string;
  lobbyState: LobbyState | undefined;
  ready: boolean;
  roomState: RoomState | undefined;
  addNextCard(): void;
  createRoom(options: RoomOptions): void;
  finishGame(): void;
  joinRoom(roomId: string): Promise<boolean> | void;
  leaveRoom(): void;
  selectSet(cards: Readonly<number[]>): void;
  setName(name: string): void;
}>({
  name: '',
  currentSessionId: '',
  lobbyState: undefined,
  ready: false,
  roomState: undefined,
  addNextCard() {},
  createRoom() {},
  finishGame() {},
  joinRoom() {},
  leaveRoom() {},
  selectSet() {},
  setName() {},
});

const initialSession = {
  id: '',
  name: '',
};

export function SocketProvider({ children }: { children: ReactNode }) {
  const socket = useSocket();
  const [session, setSession] = useState(initialSession);
  const [ready, setReady] = useState(false);
  const [lobbyState, setLobbyState] = useState<LobbyState | undefined>();
  const [roomState, setRoomState] = useState<RoomState | undefined>();

  useSocketListener(socket, 'session estabilished', (session) => {
    localStorage.setItem(storageIdKey, session.id);
    setSession(session);
    return session.id;
  });
  useSocketListener(socket, 'lobby state changed', setLobbyState);
  useSocketListener(socket, 'room state changed', setRoomState);
  useSocketListener(socket, 'server ready', () => setReady(true));
  useSocketListener(socket, 'disconnect', () => setReady(false));

  const value: ContextType<typeof SocketContext> = {
    currentSessionId: session.id,
    name: session.name,
    lobbyState,
    ready,
    roomState,
    addNextCard: useSocketEmitter(socket, ready, 'add next card'),
    createRoom: useSocketEmitter(socket, ready, 'create room'),
    finishGame: useSocketEmitter(socket, ready, 'finish game'),
    joinRoom: useSocketEmitter(socket, ready, 'join room'),
    leaveRoom: useSocketEmitter(socket, ready, 'leave room'),
    selectSet: useSocketEmitter(socket, ready, 'select set'),
    setName: useSocketEmitter(socket, ready, 'set name'),
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
