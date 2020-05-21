import { ServerEvents } from 'shared/types/ServerEvents';
import { ClientSocket, ServerSocket } from 'shared/types/Socket';

type PatchedSocket<OriginalSocket> = OriginalSocket extends SocketIO.Socket
  ? ServerSocket<ServerEvents>
  : OriginalSocket extends SocketIOClient.Socket
  ? ClientSocket<ServerEvents>
  : never;

interface Emitter {
  emit(event: string, ...args: any[]): void;
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: string, listener: (...args: any[]) => void): void;
}

export function patchSocket<OriginalSocket extends Emitter>(
  socket: OriginalSocket
): PatchedSocket<OriginalSocket> {
  const originalEmit = socket.emit;
  const originalOn = socket.on;

  return Object.assign(socket, {
    emit: (name: any, ...args: any[]) =>
      new Promise((resolve) => {
        originalEmit.call(socket, name, ...args, resolve);
      }),
    on: (name: any, listener: (...args: any[]) => any) => {
      async function listenerWithAcknowledgement(...socketIOArgs: any[]) {
        const acknowledge = socketIOArgs.pop();
        acknowledge(await listener(...socketIOArgs));
      }

      originalOn.call(socket, name, listenerWithAcknowledgement);
      return () => {
        socket.off(name, listenerWithAcknowledgement);
      };
    },
  }) as any;
}
