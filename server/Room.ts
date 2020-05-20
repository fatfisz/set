import { DatabaseSchema } from 'DatabaseSchema';
import { getPseudoUniqueId } from 'getPseudoUniqueId';
import { Players } from 'Players';
import { Session } from 'Session';
import { RoomOptions } from 'shared/types/RoomOptions';
import { Table } from 'Table';

export class Room {
  readonly id: string;
  readonly options: RoomOptions;
  private nextCardRequests = new Set<Session>();
  private players: Players;
  private table: Table;

  constructor(initialData: {
    id?: never;
    options: RoomOptions;
    players?: never;
    table?: never;
  });
  constructor(initialData: {
    id: string;
    options: RoomOptions;
    players: Players;
    table: Table;
  });
  constructor({
    id = getPseudoUniqueId(),
    options,
    players = new Players(),
    table = new Table(),
  }: {
    id?: string;
    options: RoomOptions;
    players?: Players;
    table?: Table;
  }) {
    this.id = id;
    this.options = options;
    this.players = players;
    this.table = table;
  }

  static deserialize(
    { id, options, players, table }: DatabaseSchema['room'],
    sessions: Map<string, Session>
  ): Room {
    return new Room({
      id,
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

  getState() {
    return {
      cards: this.table.getCards(),
      options: this.options,
      remainingCardCount: this.table.getRemainingCardCount(),
      scores: this.players.getScores(),
    };
  }

  addPlayer(session: Session) {
    this.players.add(session);
    session.log('Joined the room');
  }

  removePlayer(session: Session) {
    session.log('Left the room');
    this.players.delete(session);
  }

  forEachParticipant(callback: (participantSession: Session) => void) {
    this.players.forEach(callback);
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

    return true;
  }

  requestNextCard(session: Session) {
    if (this.options.autoAddCard) {
      return;
    }

    if (this.players.has(session)) {
      this.nextCardRequests.add(session);

      if (this.nextCardRequests.size === this.players.getCount()) {
        this.table.tryAddNextCard();
      }
    }
  }

  private clearNextCardRequests() {
    this.nextCardRequests.clear();
  }
}
