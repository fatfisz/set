import { ServerEvents } from 'shared/types/ServerEvents';
import { ClientSocket, ServerSocket } from 'shared/types/Socket';

type PatchedSocket<OriginalSocket> = OriginalSocket extends SocketIO.Socket
  ? ServerSocket<ServerEvents>
  : OriginalSocket extends SocketIOClient.Socket
  ? ClientSocket<ServerEvents>
  : never;

interface Emitter {
  id: string;
  emit(event: string, ...args: any[]): void;
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: string, listener: (...args: any[]) => void): void;
}

export function patchSocket<OriginalSocket extends Emitter>(
  socket: OriginalSocket
): PatchedSocket<OriginalSocket> {
  const originalEmit = socket.emit;
  const originalOn = socket.on;

  function log(...args: any[]) {
    console.log(`[${socket.id ?? '<disconnected>'}]`, ...args);
  }

  return Object.assign(socket, {
    emit: (name: any, ...args: any[]) =>
      new Promise((resolve) => {
        if (process.env.NODE_ENV !== 'production') {
          log(`[emitted: ${name}]`, ...args);
        }
        originalEmit.call(socket, name, ...args, resolve);
      }),
    on: (name: any, listener: (...args: any[]) => any) => {
      async function listenerWithAcknowledgement(...socketIOArgs: any[]) {
        const acknowledge = socketIOArgs.pop();
        if (process.env.NODE_ENV !== 'production') {
          log(`[received: ${name}]`, ...socketIOArgs);
        }
        acknowledge(await listener(...socketIOArgs));
      }

      originalOn.call(socket, name, listenerWithAcknowledgement);
      return () => {
        socket.off(name, listenerWithAcknowledgement);
      };
    },
    log,
  }) as any;
}
