import { Players } from 'Players';
import { Table } from 'Table';

export class Room {
  private options = {
    autoAddCard: true,
  };
  players = new Players();
  table = new Table();
  private nextCardRequests = new Set<string>();

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
