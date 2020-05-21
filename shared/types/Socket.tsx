import { Socket } from 'socket.io';

type Awaitable<Value> = Value | Promise<Value>;

type AnyEventPair = [any[], any];

interface ServerEvents {
  emitted: Record<string, AnyEventPair>;
  received: Record<string, AnyEventPair>;
}

export type EmittedEvents<Events extends ServerEvents> = Events['emitted'];

export type ReceivedEvents<Events extends ServerEvents> = Events['received'];

export type Listener<EventPair extends [any[], any]> = (
  ...args: EventPair[0]
) => Awaitable<EventPair[1]>;

type RemoveListener = () => void;

export interface ServerSocket<Events extends ServerEvents> {
  handshake: Socket['handshake'];

  disconnect: Socket['disconnect'];

  broadcast: ServerSocket<Events>;

  emit<EventName extends keyof EmittedEvents<Events>>(
    name: EventName,
    ...args: EmittedEvents<Events>[EventName][0]
  ): Awaitable<EmittedEvents<Events>[EventName][1]>;

  on<EventName extends keyof ReceivedEvents<Events>>(
    name: EventName,
    listener: Listener<ReceivedEvents<Events>[EventName]>
  ): RemoveListener;
  on(name: 'disconnect', listener: () => void): RemoveListener;
}

export interface ClientSocket<Events extends ServerEvents> {
  emit<EventName extends keyof ReceivedEvents<Events>>(
    name: EventName,
    ...args: ReceivedEvents<Events>[EventName][0]
  ): Awaitable<ReceivedEvents<Events>[EventName][1]>;

  on<EventName extends keyof EmittedEvents<Events>>(
    name: EventName,
    listener: Listener<EmittedEvents<Events>[EventName]>
  ): RemoveListener;
}
