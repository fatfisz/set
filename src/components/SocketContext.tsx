import EventEmitter from 'eventemitter3';
import {
  ContextType,
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import io from 'socket.io-client';

import { RoomState } from 'types/RoomState';

interface SocketEvents {
  'add next card': [];
  'room joined': [];
  'room state changed': [RoomState];
  'set selected': [Readonly<number[]>];
}

export const SocketContext = createContext<{
  addNextCard(): void;
  joinRoom(): void;
  selectSet(cards: Readonly<number[]>): void;
  sessionId: string;
  onRoomStateChanged(listener: (roomState: RoomState) => void): () => void;
}>({
  addNextCard() {},
  joinRoom() {},
  selectSet() {},
  sessionId: '',
  onRoomStateChanged() {
    return () => {};
  },
});

const storageIdKey = 'sessionId';

export function SocketContextProvider({ children }: { children: ReactNode }) {
  const eventEmitter = useMemo(() => new EventEmitter<SocketEvents>(), []);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const sessionId = localStorage.getItem(storageIdKey) ?? '';
    const socket = io({
      transports: ['websocket'],
      query: { sessionId },
    });

    setSessionId(sessionId);

    socket.on('session id generated', (sessionId: string) => {
      localStorage.setItem(storageIdKey, sessionId);
      setSessionId(sessionId);
      socket.emit('session id received', sessionId);
    });

    socket.on('room state changed', (roomState: RoomState) => {
      eventEmitter.emit('room state changed', roomState);
    });

    eventEmitter.on('room joined', () => {
      socket.emit('room joined');
    });

    eventEmitter.on('set selected', (cards) => {
      socket.emit('set selected', cards);
    });

    eventEmitter.on('add next card', () => {
      socket.emit('add next card');
    });
  }, []);

  const value: ContextType<typeof SocketContext> = {
    sessionId,
    addNextCard: () => eventEmitter.emit('add next card'),
    joinRoom: () => eventEmitter.emit('room joined'),
    selectSet: (cards) => eventEmitter.emit('set selected', cards),
    onRoomStateChanged: (listener) => {
      eventEmitter.on('room state changed', listener);
      return () => eventEmitter.off('room state changed', listener);
    },
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
