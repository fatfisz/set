import { Players } from 'Players';
import { Table } from 'Table';

export class Room {
  private options = {
    autoAddCard: true,
  };
  private nextCardRequests = new Set<string>();
  private players = new Players();
  private table = new Table();

  getState(names: Map<string, string>) {
    return {
      cards: this.table.getCards(),
      names: Object.fromEntries(names.entries()),
      nextCardRequests: [...this.nextCardRequests],
      options: this.options,
      remainingCardCount: this.table.getRemainingCardCount(),
      scores: this.players.getScores(names),
    };
  }

  addPlayer(sessionId: string) {
    this.players.add(sessionId);
    console.log(`[${sessionId}] Joined the room`);
  }

  removePlayer(sessionId: string) {
    console.log(`[${sessionId}] Left the room`);
    this.players.delete(sessionId);
  }

  forEachParticipant(callback: (participantSessionId: string) => void) {
    this.players.forEach(callback);
  }

  trySelectSet(sessionId: string, cards: number[]) {
    if (!this.table.popSet(cards)) {
      return false;
    }

    this.players.increaseScore(sessionId);

    if (this.options.autoAddCard) {
      this.table.addUntilHasSet();
    } else {
      this.clearNextCardRequests();
    }

    return true;
  }

  requestNextCard(sessionId: string) {
    if (this.options.autoAddCard) {
      return;
    }

    if (this.players.has(sessionId)) {
      this.nextCardRequests.add(sessionId);

      if (this.nextCardRequests.size === this.players.getCount()) {
        this.table.tryAddNextCard();
      }
    }
  }

  private clearNextCardRequests() {
    this.nextCardRequests.clear();
  }
}
