import EventEmitter, { ListenerFn } from 'eventemitter3';
import {
  ContextType,
  createContext,
  DependencyList,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import io from 'socket.io-client';

import { serverPort } from 'shared/serverPort';
import { ServerEvents } from 'shared/types/ServerEvents';
import {
  ClientSocket,
  EmittedEvents,
  ReceivedEvents,
} from 'shared/types/Socket';
import { RoomState } from 'types/RoomState';
import { validators } from 'validators';

type SocketEvents = {
  'room state changed': [RoomState];
};

export const SocketContext = createContext<{
  name: string;
  currentSessionId: string;
  addNextCard(): void;
  joinRoom(): void;
  selectSet(cards: Readonly<number[]>): void;
  setName(name: string): void;
  onRoomStateChanged(listener: (roomState: RoomState) => void): () => void;
}>({
  name: '',
  currentSessionId: '',
  addNextCard() {},
  joinRoom() {},
  selectSet() {},
  setName() {},
  onRoomStateChanged() {
    return () => {};
  },
});

const storageIdKey = 'sessionId';
const initialSession = {
  id: '',
  name: '',
};

export function SocketContextProvider({ children }: { children: ReactNode }) {
  const socket = useSocket();
  const eventEmitter = useMemo(() => new EventEmitter<SocketEvents>(), []);
  const [session, setSession] = useState(initialSession);

  useSocketListener(socket, 'session estabilished', (session) => {
    localStorage.setItem(storageIdKey, session.id);
    setSession(session);
    socket?.emit('confirm session', session.id);
  });

  useSocketListener(
    socket,
    'room state changed',
    (roomState) => {
      eventEmitter.emit('room state changed', roomState);
    },
    [session.id]
  );

  const value: ContextType<typeof SocketContext> = {
    name,
    currentSessionId: session.id,
    addNextCard: useSocketEmitter(socket, 'add next card'),
    joinRoom: useSocketEmitter(socket, 'join room'),
    selectSet: useSocketEmitter(socket, 'select set'),
    setName: useSocketEmitter(socket, 'set name'),
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
  const [socket, setSocket] = useState<ClientSocket<ServerEvents>>();

  useEffect(() => {
    const sessionId = localStorage.getItem(storageIdKey) ?? '';
    const socket = io(`localhost:${serverPort}`, {
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

function useSocketListener<EventName extends keyof EmittedEvents<ServerEvents>>(
  socket: ClientSocket<ServerEvents> | undefined,
  name: EventName,
  listener: (...args: EmittedEvents<ServerEvents>[EventName]) => void,
  deps: DependencyList = []
) {
  useEffect(() => {
    function listenerWithValidator(value: any) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[${name}]`, value);
      }
      validators[name](value);
      listener(value);
    }

    socket?.on(name, listenerWithValidator);
    return () => {
      socket?.off(name, listenerWithValidator);
    };
  }, [socket, ...deps]);
}

function useSocketEmitter<EventName extends keyof ReceivedEvents<ServerEvents>>(
  socket: ClientSocket<ServerEvents> | undefined,
  name: EventName
) {
  return useCallback(
    (...args: ReceivedEvents<ServerEvents>[EventName]) =>
      socket?.emit(name, ...args),
    [socket]
  );
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
