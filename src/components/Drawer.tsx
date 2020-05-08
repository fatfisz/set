import { useContext, ReactNode } from 'react';

import { SocketContext } from 'components/SocketContext';

export function Drawer({
  remainingCardCount,
  scores,
}: {
  remainingCardCount: number;
  scores: [string, number][];
}) {
  const { sessionId: currentSessionId, addNextCard } = useContext(
    SocketContext
  );
  return (
    <>
      <div className="drawer">
        <button
          disabled={remainingCardCount === 0}
          onClick={() => addNextCard()}
        >
          Add one more card
        </button>
        <Info label="Remaining cards" value={remainingCardCount} />
        <Info
          label="Your score"
          value={
            scores.find(([sessionId]) => sessionId === currentSessionId)?.[1] ??
            0
          }
        />
        <Spacer />
        {scores
          .filter(([sessionId]) => sessionId !== currentSessionId)
          .map(([sessionId, score]) => (
            <Info key={sessionId} label={sessionId} value={score} />
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
