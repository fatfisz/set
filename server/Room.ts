import * as roomCollection from 'collections/roomCollection';
import { DatabaseSchema } from 'DatabaseSchema';
import { getPseudoUniqueId } from 'getPseudoUniqueId';
import { Players } from 'Players';
import { Session } from 'Session';
import { RoomOptions } from 'shared/types/RoomOptions';
import { RoomState } from 'shared/types/RoomState';
import { Table } from 'Table';

export class Room {
  readonly id: string;
  readonly options: RoomOptions;
  private manuallyFinished: boolean;
  private finishGameRequests = new Set<Session>();
  private nextCardRequests = new Set<Session>();
  private players: Players;
  private table: Table;

  constructor(initialData: {
    id?: never;
    manuallyFinished?: never;
    options: RoomOptions;
    players?: never;
    table?: never;
  });
  constructor(initialData: {
    id: string;
    manuallyFinished: boolean;
    options: RoomOptions;
    players: Players;
    table: Table;
  });
  constructor({
    id,
    manuallyFinished = false,
    options,
    players = new Players(),
    table = new Table(),
  }: {
    id?: string;
    manuallyFinished?: boolean;
    options: RoomOptions;
    players?: Players;
    table?: Table;
  }) {
    this.id = id ?? getPseudoUniqueId();
    this.manuallyFinished = manuallyFinished;
    this.options = options;
    this.players = players;
    this.table = table;

    if (!id) {
      roomCollection.insertOne(this.serialize());
    }
  }

  serialize(): DatabaseSchema['room'] {
    return {
      id: this.id,
      manuallyFinished: this.manuallyFinished,
      options: this.options,
      players: this.players.serialize(),
      table: this.table.serialize(),
    };
  }

  static deserialize(
    { id, manuallyFinished, options, players, table }: DatabaseSchema['room'],
    sessions: Map<string, Session>
  ): Room {
    return new Room({
      id,
      manuallyFinished,
      options,
      players: Players.deserialize(players, sessions),
      table: Table.deserialize(table),
    });
  }

  getLobbyState() {
    return {
      id: this.id,
      name: this.options.name,
    };
  }

  getState(): RoomState {
    return {
      cards: this.table.getCards(),
      isFinished: this.options.autoAddCard
        ? this.table.isFinished()
        : this.manuallyFinished,
      options: this.options,
      remainingCardCount: this.table.getRemainingCardCount(),
      scores: this.players.getScores(),
    };
  }

  addPlayer(session: Session) {
    this.players.add(session);
    session.socket?.log('Joined the room');
    roomCollection.updateOne(this.id, {
      $set: { players: this.players.serialize() },
    });
  }

  removePlayer(session: Session) {
    session.socket?.log('Left the room');
    this.players.delete(session);
    roomCollection.updateOne(this.id, {
      $set: { players: this.players.serialize() },
    });
  }

  forEachParticipant(callback: (participantSession: Session) => void) {
    this.players.forEachActivePlayer(callback);
  }

  trySelectSet(session: Session, cards: number[]) {
    if (!this.table.popSet(cards)) {
      return false;
    }

    this.players.increaseScore(session);

    if (this.options.autoAddCard) {
      this.table.addUntilHasSet();
    } else {
      this.clearNextCardRequests();
    }

    roomCollection.updateOne(this.id, {
      $set: {
        players: this.players.serialize(),
        table: this.table.serialize(),
      },
    });

    return true;
  }

  requestNextCard(session: Session) {
    if (this.options.autoAddCard) {
      return;
    }

    if (this.players.hasAnActivePlayer(session)) {
      this.nextCardRequests.add(session);

      if (this.hasAllActivePlayers(this.nextCardRequests)) {
        this.table.tryAddNextCard();
        roomCollection.updateOne(this.id, {
          $set: { table: this.table.serialize() },
        });
      }
    }
  }

  requestFinishGame(session: Session) {
    if (this.options.autoAddCard) {
      return;
    }

    if (this.players.hasAnActivePlayer(session)) {
      this.finishGameRequests.add(session);

      if (this.hasAllActivePlayers(this.finishGameRequests)) {
        this.manuallyFinished = true;
        roomCollection.updateOne(this.id, {
          $set: { manuallyFinished: true },
        });
      }
    }
  }

  private clearNextCardRequests() {
    this.nextCardRequests.clear();
  }

  private hasAllActivePlayers(players: Set<Session>) {
    return this.players.everyActivePlayer((player) => players.has(player));
  }
}
