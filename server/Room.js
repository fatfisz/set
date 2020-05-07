const { Players } = require('./Players');
const { Table } = require('./Table');

exports.Room = class Room {
  constructor() {
    this.players = new Players();
    this.table = new Table();
  }

  getState() {
    return {
      cards: this.table.getCards(),
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
    return true;
  }
};
