exports.Players = class Players {
  #sessionIds = new Set();
  #scores = new Map();

  getScores(names) {
    return [...this.#sessionIds]
      .map((sessionId) => ({
        sessionId,
        name: names.get(sessionId),
        score: this.#scores.get(sessionId),
      }))
      .sort(
        (playerA, playerB) =>
          playerB.score - playerA.score ||
          playerA.sessionId.localeCompare(playerB.sessionId)
      );
  }

  has(sessionId) {
    return this.#sessionIds.has(sessionId);
  }

  getCount() {
    return this.#sessionIds.size;
  }

  add(sessionId) {
    if (!this.has(sessionId)) {
      this.#sessionIds.add(sessionId);
      this.#scores.set(sessionId, 0);
    }
  }

  delete(sessionId) {
    this.#sessionIds.delete(sessionId);
    this.#scores.delete(sessionId);
  }

  increaseScore(sessionId) {
    if (!this.has(sessionId)) {
      return;
    }
    this.#scores.set(sessionId, this.#scores.get(sessionId) + 1);
  }
};
