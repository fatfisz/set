exports.Players = class Players {
  #players = new Map();

  getScores() {
    return [...this.#players.entries()].sort(
      ([sessionIdA, scoreA], [sessionIdB, scoreB]) =>
        scoreB - scoreA || sessionIdA.localeCompare(sessionIdB)
    );
  }

  hasPlayer(sessionId) {
    return this.#players.has(sessionId);
  }

  getPlayerCount() {
    return this.#players.size;
  }

  ensurePlayer(sessionId) {
    if (!this.#players.has(sessionId)) {
      this.#players.set(sessionId, 0);
    }
  }

  increasePlayerScore(sessionId) {
    if (!this.#players.has(sessionId)) {
      return;
    }
    this.#players.set(sessionId, this.#players.get(sessionId) + 1);
  }
};
