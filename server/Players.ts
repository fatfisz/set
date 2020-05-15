import { Session } from 'Session';

export class Players {
  private sessions = new Set<Session>();
  private scores = new Map<Session, number>();

  getScores() {
    return [...this.sessions]
      .map((session) => ({
        sessionId: session.id,
        name: session.name,
        score: this.scores.get(session) as number,
      }))
      .sort(
        (playerA, playerB) =>
          playerB.score - playerA.score ||
          playerA.sessionId.localeCompare(playerB.sessionId)
      );
  }

  has(session: Session) {
    return this.sessions.has(session);
  }

  getCount() {
    return this.sessions.size;
  }

  add(session: Session) {
    if (!this.has(session)) {
      this.sessions.add(session);
      this.scores.set(session, 0);
    }
  }

  delete(session: Session) {
    this.sessions.delete(session);
    this.scores.delete(session);
  }

  forEach(callback: (session: Session) => void) {
    this.sessions.forEach(callback);
  }

  increaseScore(session: Session) {
    if (!this.has(session)) {
      return;
    }
    this.scores.set(session, (this.scores.get(session) as number) + 1);
  }
}
