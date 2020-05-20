import { DatabaseSchema } from 'DatabaseSchema';
import { Session } from 'Session';
import { getOrThrow } from 'shared/getOrThrow';

export class Players {
  private activeSessions = new Set<Session>();
  private scores: Map<Session, number>;

  constructor();
  constructor(initialData: { scores: Map<Session, number> });
  constructor({ scores } = { scores: new Map<Session, number>() }) {
    this.scores = scores;
  }

  serialize(): DatabaseSchema['room']['players'] {
    return {
      scores: Object.fromEntries(
        [...this.scores].map(([session, score]) => [session.id, score])
      ),
    };
  }

  static deserialize(
    data: DatabaseSchema['room']['players'],
    sessions: Map<string, Session>
  ): Players {
    return new Players({
      scores: new Map(
        Object.entries(data.scores).map(([sessionId, score]) => [
          getOrThrow(sessions, sessionId),
          score,
        ])
      ),
    });
  }

  getScores() {
    return [...this.scores]
      .map(([session, score]) => ({
        sessionId: session.id,
        name: session.name,
        score,
      }))
      .sort(
        (playerA, playerB) =>
          playerB.score - playerA.score ||
          playerA.sessionId.localeCompare(playerB.sessionId)
      );
  }

  hasAnActivePlayer(session: Session) {
    return this.activeSessions.has(session);
  }

  getActivePlayerCount() {
    return this.activeSessions.size;
  }

  add(session: Session) {
    if (!this.activeSessions.has(session)) {
      this.activeSessions.add(session);
    }
    if (!this.scores.has(session)) {
      this.scores.set(session, 0);
    }
  }

  delete(session: Session) {
    this.activeSessions.delete(session);
  }

  forEachActivePlayer(callback: (session: Session) => void) {
    this.activeSessions.forEach(callback);
  }

  increaseScore(session: Session) {
    if (!this.scores.has(session)) {
      return;
    }
    this.scores.set(session, (this.scores.get(session) as number) + 1);
  }
}
