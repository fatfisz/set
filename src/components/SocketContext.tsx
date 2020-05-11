import EventEmitter, { ListenerFn } from 'eventemitter3';
import {
  ContextType,
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
  useCallback,
  DependencyList,
} from 'react';
import io from 'socket.io-client';

import { RoomState } from 'types/RoomState';
import { ServerEvents } from 'types/ServerEvents';
import { validators } from 'validators';

interface SocketEvents {
  'room state changed': [RoomState];
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
  const socket = useSocket();
  const eventEmitter = useMemo(() => new EventEmitter<SocketEvents>(), []);
  const [name, setName] = useState('');
  const [sessionId, setSessionId] = useState('');

  useSocketListener(socket, 'session id generated', (sessionId) => {
    localStorage.setItem(storageIdKey, sessionId);
    setSessionId(sessionId);
    socket?.emit('session id received', sessionId);
  });

  useSocketListener(
    socket,
    'room state changed',
    (serverRoomState) => {
      const { names, ...roomState } = serverRoomState;
      setName(names[sessionId]);
      eventEmitter.emit('room state changed', roomState);
    },
    [sessionId]
  );

  const value: ContextType<typeof SocketContext> = {
    name,
    sessionId,
    addNextCard: useSocketEmitter(socket, 'add next card'),
    joinRoom: useSocketEmitter(socket, 'room joined'),
    selectSet: useSocketEmitter(socket, 'set selected'),
    setName: useSocketEmitter(socket, 'name set'),
    onRoomStateChanged: useEventListenerSetter(
      eventEmitter,
      'room state changed'
    ),
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

function useSocket() {
  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  useEffect(() => {
    const sessionId = localStorage.getItem(storageIdKey) ?? '';
    const socket = io({
      transports: ['websocket'],
      query: { sessionId },
    });

    setSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  return socket;
}

function useSocketListener<EventName extends keyof ServerEvents>(
  socket: SocketIOClient.Socket | undefined,
  name: EventName,
  listener: (value: ServerEvents[EventName]) => void,
  deps: DependencyList = []
) {
  useEffect(() => {
    function listenerWithValidator(value: any) {
      validators[name](value);
      listener(value);
    }

    socket?.on(name, listenerWithValidator);
    return () => {
      socket?.off(name, listenerWithValidator);
    };
  }, [socket, ...deps]);
}

function useSocketEmitter(
  socket: SocketIOClient.Socket | undefined,
  name: string
) {
  return useCallback((...args) => socket?.emit(name, ...args), [socket]);
}

function useEventListenerSetter<EventName extends keyof SocketEvents>(
  eventEmitter: EventEmitter<SocketEvents>,
  name: EventName
) {
  return useCallback(
    (listener: ListenerFn<SocketEvents[EventName]>) => {
      eventEmitter.on(name, listener);
      return () => eventEmitter.off(name, listener);
    },
    [eventEmitter, name]
  );
}
