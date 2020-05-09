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

import { RoomState, ServerRoomState } from 'types/RoomState';
import * as validators from 'validators';

interface SocketEvents {
  'add next card': [];
  'name set': [string];
  'room joined': [];
  'room state changed': [RoomState];
  'set selected': [Readonly<number[]>];
}

export const SocketContext = createContext<{
  name: string;
  sessionId: string;
  addNextCard(): void;
  joinRoom(): void;
  selectSet(cards: Readonly<number[]>): void;
  setName(name: string): void;
  onRoomStateChanged(listener: (roomState: RoomState) => void): () => void;
}>({
  name: '',
  sessionId: '',
  addNextCard() {},
  joinRoom() {},
  selectSet() {},
  setName() {},
  onRoomStateChanged() {
    return () => {};
  },
});

const storageIdKey = 'sessionId';

export function SocketContextProvider({ children }: { children: ReactNode }) {
  const eventEmitter = useMemo(() => new EventEmitter<SocketEvents>(), []);
  const [name, setName] = useState('');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const sessionId = localStorage.getItem(storageIdKey) ?? '';
    const socket = io({
      transports: ['websocket'],
      query: { sessionId },
    });

    setSessionId(sessionId);

    socket.on('session id generated', (sessionId: string) => {
      validators.sessionId(sessionId);
      localStorage.setItem(storageIdKey, sessionId);
      setSessionId(sessionId);
      socket.emit('session id received', sessionId);
    });

    socket.on('room state changed', (serverRoomState: ServerRoomState) => {
      validators.roomState(serverRoomState);
      const { names, ...roomState } = serverRoomState;
      setName(names[localStorage.getItem(storageIdKey) as string]);
      eventEmitter.emit('room state changed', roomState);
    });

    eventEmitter.on('add next card', () => {
      socket.emit('add next card');
    });

    eventEmitter.on('name set', (name) => {
      socket.emit('name set', name);
    });

    eventEmitter.on('room joined', () => {
      socket.emit('room joined');
    });

    eventEmitter.on('set selected', (cards) => {
      socket.emit('set selected', cards);
    });

    return () => {
      eventEmitter.removeAllListeners();
    };
  }, []);

  const value: ContextType<typeof SocketContext> = {
    name,
    sessionId,
    addNextCard: () => eventEmitter.emit('add next card'),
    joinRoom: () => eventEmitter.emit('room joined'),
    selectSet: (cards) => eventEmitter.emit('set selected', cards),
    setName: (name) => eventEmitter.emit('name set', name),
    onRoomStateChanged: (listener) => {
      eventEmitter.on('room state changed', listener);
      return () => eventEmitter.off('room state changed', listener);
    },
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
