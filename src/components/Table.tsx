import { MouseEvent, useCallback, useContext } from 'react';

import { Card } from 'components/Card';
import { SelectedCardsContext } from 'components/SelectedCardsContext';
import { cardHeight, cardWidth, emptyCard, rowCount } from 'config/card';

const padding = 32;
const gap = 32;

export function Table({ cards }: { cards?: number[] }) {
  const resetOnClick = useResetOnClick();
  return (
    <>
      <div className="center-wrapper" onClick={resetOnClick}>
        <TableCards cards={cards} />
      </div>

      <style jsx>{`
        .center-wrapper {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  );
}

function useResetOnClick() {
  const { reset } = useContext(SelectedCardsContext);
  return useCallback(
    (event: MouseEvent) => {
      if (event.currentTarget === event.target) {
        reset();
      }
    },
    [reset]
  );
}

function TableCards({ cards }: { cards?: number[] }) {
  if (!cards) {
    return null;
  }

  const columnCount = Math.ceil(cards.length / rowCount);
  const width = 2 * padding + columnCount * (cardWidth + gap) - gap;

  return (
    <>
      <div className="table mouse-fallthrough" style={{ width }}>
        {cards.map((card, index) =>
          card === emptyCard ? (
            <div key={index} style={{ height: cardHeight, width: cardWidth }} />
          ) : (
            <div key={index} className="enable-pointer-events">
              <Card card={card} />
            </div>
          )
        )}
      </div>

      <style jsx>{`
        .table {
          align-content: center;
          display: grid;
          gap: ${gap}px;
          grid-auto-flow: column;
          grid-template-rows: repeat(${rowCount}, max-content);
          justify-content: start;
          padding: ${padding}px;
          pointer-events: none;
          transition: width 400ms;
        }

        .enable-pointer-events {
          pointer-events: auto;
        }
      `}</style>
    </>
  );
}
