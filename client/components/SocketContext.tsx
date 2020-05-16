import {
  ContextType,
  createContext,
  DependencyList,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import io from 'socket.io-client';

import { serverPort } from 'shared/serverPort';
import { RoomState } from 'shared/types/RoomState';
import { ServerEvents } from 'shared/types/ServerEvents';
import {
  ClientSocket,
  EmittedEvents,
  ReceivedEvents,
} from 'shared/types/Socket';
import { validators } from 'validators';

export const SocketContext = createContext<{
  name: string;
  currentSessionId: string;
  roomState: RoomState | undefined;
  addNextCard(): void;
  joinRoom(): void;
  selectSet(cards: Readonly<number[]>): void;
  setName(name: string): void;
}>({
  name: '',
  currentSessionId: '',
  roomState: undefined,
  addNextCard() {},
  joinRoom() {},
  selectSet() {},
  setName() {},
});

const storageIdKey = 'sessionId';
const initialSession = {
  id: '',
  name: '',
};

export function SocketContextProvider({ children }: { children: ReactNode }) {
  const socket = useSocket();
  const [session, setSession] = useState(initialSession);
  const [roomState, setRoomState] = useState<RoomState | undefined>();

  useSocketListener(socket, 'session estabilished', (session) => {
    localStorage.setItem(storageIdKey, session.id);
    setSession(session);
    socket?.emit('confirm session', session.id);
  });

  useSocketListener(socket, 'room state changed', setRoomState, [session.id]);

  const value: ContextType<typeof SocketContext> = {
    currentSessionId: session.id,
    name: session.name,
    roomState,
    addNextCard: useSocketEmitter(socket, 'add next card'),
    joinRoom: useSocketEmitter(socket, 'join room'),
    selectSet: useSocketEmitter(socket, 'select set'),
    setName: useSocketEmitter(socket, 'set name'),
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
    function listenerWithValidator(
      ...args: EmittedEvents<ServerEvents>[EventName]
    ) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[${name}]`, ...args);
      }
      validators[name](...args);
      listener(...args);
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
