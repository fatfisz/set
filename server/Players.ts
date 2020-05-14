export class Players {
  private sessionIds = new Set<string>();
  private scores = new Map<string, number>();

  getScores(names: Map<string, string>) {
    return [...this.sessionIds]
      .map((sessionId) => ({
        sessionId,
        name: names.get(sessionId) as string,
        score: this.scores.get(sessionId) as number,
      }))
      .sort(
        (playerA, playerB) =>
          playerB.score - playerA.score ||
          playerA.sessionId.localeCompare(playerB.sessionId)
      );
  }

  has(sessionId: string) {
    return this.sessionIds.has(sessionId);
  }

  getCount() {
    return this.sessionIds.size;
  }

  add(sessionId: string) {
    if (!this.has(sessionId)) {
      this.sessionIds.add(sessionId);
      this.scores.set(sessionId, 0);
    }
  }

  delete(sessionId: string) {
    this.sessionIds.delete(sessionId);
    this.scores.delete(sessionId);
  }

  increaseScore(sessionId: string) {
    if (!this.has(sessionId)) {
      return;
    }
    this.scores.set(sessionId, (this.scores.get(sessionId) as number) + 1);
  }
}
