const { Players } = require('./Players');
const { Table } = require('./Table');

exports.Room = class Room {
  players = new Players();
  table = new Table();
  #nextCardRequests = new Set();

  getState() {
    return {
      cards: this.table.getCards(),
      nextCardRequests: [...this.#nextCardRequests],
      remainingCardCount: this.table.getRemainingCardCount(),
      scores: this.players.getScores(),
    };
  }

  trySelectSet(sessionId, cards) {
    if (!this.table.popSet(cards)) {
      return false;
    }

    this.players.ensurePlayer(sessionId);
    this.players.increasePlayerScore(sessionId);
    this.#clearNextCardRequests();
    return true;
  }

  requestNextCard(sessionId) {
    if (this.players.hasPlayer(sessionId)) {
      this.#nextCardRequests.add(sessionId);

      if (this.#nextCardRequests.size === this.players.getPlayerCount()) {
        this.table.tryAddNextCard();
      }
    }
  }

  #clearNextCardRequests() {
    this.#nextCardRequests.clear();
  }
};
