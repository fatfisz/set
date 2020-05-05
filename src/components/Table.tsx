import { MouseEvent, useCallback, useContext } from 'react';

import { Card } from 'components/Card';
import { TableStateContext } from 'components/TableStateContext';
import { cardHeight, cardWidth, rowCount } from 'config/card';
import { MaybeCardDescription } from 'types/Card';

const padding = 32;
const gap = 32;

export function Table({ cards }: { cards: MaybeCardDescription[] }) {
  const columnCount = Math.ceil(cards.length / rowCount);
  const width = 2 * padding + columnCount * (cardWidth + gap) - gap;
  const resetOnClick = useResetOnClick();
  return (
    <>
      <div className="center-wrapper" onClick={resetOnClick}>
        <div className="table mouse-fallthrough" style={{ width }}>
          {cards.map((cardProps, index) =>
            typeof cardProps === 'undefined' ? (
              <div
                key={index}
                style={{ height: cardHeight, width: cardWidth }}
              />
            ) : (
              <div key={index} className="enable-pointer-events">
                <Card {...cardProps} />
              </div>
            )
          )}
        </div>
      </div>

      <style jsx>{`
        .center-wrapper {
          display: flex;
          justify-content: center;
        }

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

function useResetOnClick() {
  const { reset } = useContext(TableStateContext);
  return useCallback(
    (event: MouseEvent) => {
      if (event.currentTarget === event.target) {
        reset();
      }
    },
    [reset]
  );
}
