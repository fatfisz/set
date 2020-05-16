import { getPseudoUniqueId } from 'getPseudoUniqueId';
import { Players } from 'Players';
import { Session } from 'Session';
import { RoomOptions } from 'shared/types/RoomOptions';
import { Table } from 'Table';

export class Room {
  readonly id: string;
  readonly options: RoomOptions;
  private nextCardRequests = new Set<Session>();
  private players = new Players();
  private table = new Table();

  constructor(options: RoomOptions) {
    this.id = getPseudoUniqueId();
    this.options = options;
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
