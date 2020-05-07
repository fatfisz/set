import EventEmitter from 'eventemitter3';
import {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  ContextType,
} from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext<{
  onRoomJoined(listener: (cards: number[]) => void): void;
}>({
  onRoomJoined() {},
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

    socket.on('room joined', (cards: number[]) => {
      eventEmitter.emit('room joined', cards);
    });
  }, []);

  const value: ContextType<typeof SocketContext> = {
    onRoomJoined: (listener) => eventEmitter.on('room joined', listener),
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}