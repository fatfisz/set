const { Players } = require('./Players');
const { Table } = require('./Table');

exports.Room = class Room {
  players = new Players();
  table = new Table();
  #nextCardRequests = new Set();

  getState(names) {
    return {
      cards: this.table.getCards(),
      names: Object.fromEntries(names.entries()),
      nextCardRequests: [...this.#nextCardRequests],
      remainingCardCount: this.table.getRemainingCardCount(),
      scores: this.players.getScores(names),
    };
  }

  trySelectSet(sessionId, cards) {
    if (!this.table.popSet(cards)) {
      return false;
    }

    this.players.increaseScore(sessionId);
    this.#clearNextCardRequests();
    return true;
  }

  requestNextCard(sessionId) {
    if (this.players.has(sessionId)) {
      this.#nextCardRequests.add(sessionId);

      if (this.#nextCardRequests.size === this.players.getCount()) {
        this.table.tryAddNextCard();
      }
    }
  }

  #clearNextCardRequests() {
    this.#nextCardRequests.clear();
  }
};
