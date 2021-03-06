type Awaitable<Value> = Value | Promise<Value>;

type AnyEventPair = [any[], any];

interface ServerEvents {
  emitted: Record<string, AnyEventPair>;
  received: Record<string, AnyEventPair>;
}

export type EmittedEvents<Events extends ServerEvents> = Events['emitted'];

export type ReceivedEvents<Events extends ServerEvents> = Events['received'];

export type Listener<EventPair extends AnyEventPair> = (
  ...args: EventPair[0]
) => Awaitable<EventPair[1]>;

type RemoveListener = () => void;

export interface ServerSocket<Events extends ServerEvents> {
  broadcast: ServerSocket<Events>;
  disconnect: SocketIO.Socket['disconnect'];
  handshake: SocketIO.Socket['handshake'];
  id: SocketIO.Socket['id'];

  emit<EventName extends keyof EmittedEvents<Events>>(
    name: EventName,
    ...args: EmittedEvents<Events>[EventName][0]
  ): Promise<EmittedEvents<Events>[EventName][1]>;

  on<EventName extends keyof ReceivedEvents<Events>>(
    name: EventName,
    listener: Listener<ReceivedEvents<Events>[EventName]>
  ): RemoveListener;

  log(...args: any[]): void;
}

export interface ClientSocket<Events extends ServerEvents> {
  emit<EventName extends keyof ReceivedEvents<Events>>(
    name: EventName,
    ...args: ReceivedEvents<Events>[EventName][0]
  ): Promise<ReceivedEvents<Events>[EventName][1]>;

  on<EventName extends keyof EmittedEvents<Events>>(
    name: EventName,
    listener: Listener<EmittedEvents<Events>[EventName]>
  ): RemoveListener;

  log(...args: any[]): void;
}
