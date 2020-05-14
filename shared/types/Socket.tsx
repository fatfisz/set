import { Socket } from 'socket.io';

interface ServerEvents {
  emitted: Record<string, any[]>;
  received: Record<string, any[]>;
}

export type EmittedEvents<Events extends ServerEvents> = Events['emitted'];
export type ReceivedEvents<Events extends ServerEvents> = Events['received'];

export interface ServerSocket<Events extends ServerEvents> {
  handshake: Socket['handshake'];

  disconnect: Socket['disconnect'];

  broadcast: ServerSocket<Events>;

  emit<EventName extends keyof EmittedEvents<Events>>(
    name: EventName,
    ...args: EmittedEvents<Events>[EventName]
  ): void;

  on<EventName extends keyof ReceivedEvents<Events>>(
    name: EventName,
    listener: (...args: ReceivedEvents<Events>[EventName]) => void
  ): void;

  off<EventName extends keyof ReceivedEvents<Events>>(
    name: EventName,
    listener: (...args: ReceivedEvents<Events>[EventName]) => void
  ): void;

  on(name: 'disconnect', listener: () => void): void;

  off(name: 'disconnect', listener: () => void): void;
}

export interface ClientSocket<Events extends ServerEvents> {
  emit<EventName extends keyof ReceivedEvents<Events>>(
    name: EventName,
    ...args: ReceivedEvents<Events>[EventName]
  ): void;

  on<EventName extends keyof EmittedEvents<Events>>(
    name: EventName,
    listener: (...args: EmittedEvents<Events>[EventName]) => void
  ): void;

  off<EventName extends keyof EmittedEvents<Events>>(
    name: EventName,
    listener: (...args: EmittedEvents<Events>[EventName]) => void
  ): void;
}
