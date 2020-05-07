import EventEmitter from 'eventemitter3';
import {
  ContextType,
  createContext,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';
import io from 'socket.io-client';

import { RoomState } from 'types/RoomState';

export const SocketContext = createContext<{
  onRoomStateChanged(listener: (roomState: RoomState) => void): void;
  selectSet(cards: Readonly<number[]>): void;
}>({
  onRoomStateChanged() {},
  selectSet() {},
});

const storageIdKey = 'sessionId';

export function SocketContextProvider({ children }: { children: ReactNode }) {
  const eventEmitter = useMemo(() => new EventEmitter(), []);

  useEffect(() => {
    const socket = io({
      transports: ['websocket'],
      query: {
        sessionId: localStorage.getItem(storageIdKey),
      },
    });

    socket.on('session id generated', (sessionId: string) => {
      localStorage.setItem(storageIdKey, sessionId);
      socket.emit('session id received', sessionId);
    });

    socket.on('room state changed', (roomState: RoomState) => {
      eventEmitter.emit('room state changed', roomState);
    });

    eventEmitter.on('set selected', (cards: number[]) => {
      socket.emit('set selected', cards);
    });
  }, []);

  const value: ContextType<typeof SocketContext> = {
    onRoomStateChanged: (listener) =>
      eventEmitter.on('room state changed', listener),
    selectSet: (cards) => eventEmitter.emit('set selected', cards),
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
