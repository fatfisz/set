import { useContext, ReactNode } from 'react';

import { Nick } from 'components/Nick';
import { SocketContext } from 'components/SocketContext';

export function Drawer({
  options,
  remainingCardCount,
  scores,
}: {
  options: {
    autoAddCard: boolean;
  };
  remainingCardCount: number;
  scores: {
    sessionId: string;
    name: string;
    score: number;
  }[];
}) {
  const { currentSessionId, addNextCard } = useContext(SocketContext);
  return (
    <>
      <div className="drawer">
        <Nick />
        {!options.autoAddCard && (
          <button
            disabled={remainingCardCount === 0}
            onClick={() => addNextCard()}
          >
            Add one more card
          </button>
        )}
        <Info label="Remaining cards" value={remainingCardCount} />
        <Info
          label="Your score"
          value={
            scores.find(({ sessionId }) => sessionId === currentSessionId)
              ?.score ?? 0
          }
        />
        <Spacer />
        {scores
          .filter(({ sessionId }) => sessionId !== currentSessionId)
          .map(({ sessionId, name, score }) => (
            <Info key={sessionId} label={name} value={score} />
          ))}
      </div>

      <style jsx>{`
        .drawer {
          aligin-items: start;
          background: #000000a0;
          cursor: default;
          display: grid;
          gap: 16px;
          grid-template-rows: repeat(auto-fit, minmax(0, max-content));
          padding: 32px;
        }
      `}</style>
    </>
  );
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <strong>{label}:</strong> {value}
    </div>
  );
}

function Spacer() {
  return <div style={{ height: 16 }} />;
}
