import { DependencyList, useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';

import { storageIdKey } from 'config/storage';
import { serverPort } from 'shared/serverPort';
import { ServerEvents } from 'shared/types/ServerEvents';
import {
  ClientSocket,
  EmittedEvents,
  ReceivedEvents,
} from 'shared/types/Socket';
import { validators } from 'validators';

export function useSocket() {
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

export function useSocketListener<
  EventName extends keyof EmittedEvents<ServerEvents>
>(
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

export function useSocketEmitter<
  EventName extends keyof ReceivedEvents<ServerEvents>
>(
  socket: ClientSocket<ServerEvents> | undefined,
  ready: boolean,
  name: EventName
) {
  return useCallback(
    (...args: ReceivedEvents<ServerEvents>[EventName]) => {
      if (ready) {
        socket?.emit(name, ...args);
      }
    },
    [ready, socket]
  );
}
