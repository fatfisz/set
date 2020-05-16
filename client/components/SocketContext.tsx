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
  roomState: RoomState | undefined;
  addNextCard(): void;
  createRoom(options: RoomOptions): void;
  joinRoom(roomId: string): void;
  leaveRoom(): void;
  selectSet(cards: Readonly<number[]>): void;
  setName(name: string): void;
}>({
  name: '',
  currentSessionId: '',
  lobbyState: undefined,
  roomState: undefined,
  addNextCard() {},
  createRoom() {},
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
  const [lobbyState, setLobbyState] = useState<LobbyState | undefined>();
  const [roomState, setRoomState] = useState<RoomState | undefined>();

  useSocketListener(socket, 'session estabilished', (session) => {
    localStorage.setItem(storageIdKey, session.id);
    setSession(session);
    socket?.emit('confirm session', session.id);
  });

  useSocketListener(socket, 'lobby state changed', setLobbyState);

  useSocketListener(socket, 'room state changed', setRoomState);

  const value: ContextType<typeof SocketContext> = {
    currentSessionId: session.id,
    name: session.name,
    lobbyState,
    roomState,
    addNextCard: useSocketEmitter(socket, 'add next card'),
    createRoom: useSocketEmitter(socket, 'create room'),
    joinRoom: useSocketEmitter(socket, 'join room'),
    leaveRoom: useSocketEmitter(socket, 'leave room'),
    selectSet: useSocketEmitter(socket, 'select set'),
    setName: useSocketEmitter(socket, 'set name'),
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
