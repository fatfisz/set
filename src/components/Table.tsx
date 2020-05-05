import { Card } from 'components/Card';
import { cardHeight, cardWidth, rowCount } from 'config/card';
import { MaybeCardDescription } from 'types/Card';

const padding = 32;
const gap = 32;

export function Table({ cards }: { cards: MaybeCardDescription[] }) {
  const columnCount = Math.ceil(cards.length / rowCount);
  const width = 2 * padding + columnCount * (cardWidth + gap) - gap;
  return (
    <>
      <div className="center-wrapper">
        <div className="table" style={{ width }}>
          {cards.map((cardProps, index) =>
            typeof cardProps === 'undefined' ? (
              <div
                key={index}
                style={{ height: cardHeight, width: cardWidth }}
              />
            ) : (
              <Card key={index} {...cardProps} />
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
          transition: width 400ms;
        }
      `}</style>
    </>
  );
}
