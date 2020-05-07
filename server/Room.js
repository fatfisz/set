const { Players } = require('./Players');
const { Table } = require('./Table');

exports.Room = class Room {
  constructor() {
    this.players = new Players();
    this.table = new Table();
  }

  getState() {
    return {
      scores: this.players.getScores(),
      cards: this.table.getCards(),
      remainingCardCount: this.table.getRemainingCardCount(),
    };
  }

  trySelectSet(playerId, cards) {
    if (!this.table.popSet(cards)) {
      return false;
    }

    this.players.ensurePlayer(playerId);
    this.players.increasePlayerScore(playerId);
    return true;
  }
};
