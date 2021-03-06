import { DependencyList, useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';

import { storageIdKey } from 'config/storage';
import { patchSocket } from 'shared/patchSocket';
import { serverPort } from 'shared/serverPort';
import { ServerEvents } from 'shared/types/ServerEvents';
import {
  ClientSocket,
  EmittedEvents,
  Listener,
  ReceivedEvents,
} from 'shared/types/Socket';
import { validators } from 'validators';

declare global {
  interface Window {
    globalSocket: ClientSocket<ServerEvents>;
  }
}

if (
  typeof window !== 'undefined' &&
  typeof window.globalSocket === 'undefined'
) {
  const sessionId = localStorage.getItem(storageIdKey) ?? '';
  const socket = io(`localhost:${serverPort}`, {
    transports: ['websocket'],
    query: { sessionId },
  });
  window.globalSocket = patchSocket(socket);
}

export function useSocket() {
  const [socket, setSocket] = useState<ClientSocket<ServerEvents>>();

  useEffect(() => {
    setSocket(window.globalSocket);
    return () => setSocket(undefined);
  }, []);

  return socket;
}

export function useSocketListener<
  EventName extends keyof EmittedEvents<ServerEvents>
>(
  socket: ClientSocket<ServerEvents> | undefined,
  name: EventName,
  listener: Listener<EmittedEvents<ServerEvents>[EventName]>,
  deps: DependencyList = []
) {
  useEffect(() => {
    function listenerWithValidator(
      ...args: EmittedEvents<ServerEvents>[EventName][0]
    ) {
      validators[name](...args);
      return listener(...args);
    }

    return socket?.on(name, listenerWithValidator);
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
    async (...args: ReceivedEvents<ServerEvents>[EventName][0]) => {
      if (ready) {
        return socket?.emit(name, ...args);
      }
    },
    [ready, socket]
  );
}
