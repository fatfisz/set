exports.Players = class Players {
  #players = new Map();

  getScores() {
    return [...this.#players.entries()].sort(
      ([playerIdA, scoreA], [playerIdB, scoreB]) =>
        scoreB - scoreA || playerIdA.localeCompare(playerIdB)
    );
  }

  ensurePlayer(playerId) {
    if (!this.#players.has(playerId)) {
      this.#players.set(playerId, 0);
    }
  }

  increasePlayerScore(playerId) {
    if (!this.#players.has(playerId)) {
      return;
    }
    this.#players.set(playerId, this.#players.get(playerId) + 1);
  }
};
