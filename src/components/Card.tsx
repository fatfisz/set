import classNames from 'classnames';
import { useContext } from 'react';

import { shapeImageDescriptions } from 'components/CardDefs';
import { TableStateContext } from 'components/TableStateContext';
import { cardHeight, cardWidth } from 'config/card';
import { Color, Number, Shade, Shape } from 'types/Card';
import * as colors from 'config/colors';

export function Card({
  color,
  number,
  shade,
  shape,
}: {
  color: Color;
  number: Number;
  shade: Shade;
  shape: Shape;
}) {
  const card = { color, number, shade, shape };
  const { checkIsSelected, select } = useContext(TableStateContext);
  return (
    <>
      <div
        className={classNames('card', {
          selected: checkIsSelected(card),
        })}
        onClick={() => select(card)}
      >
        {Array.from({ length: number }, (_value, key) => (
          <ShapeImage key={key} color={color} shade={shade} shape={shape} />
        ))}
      </div>

      <style jsx>{`
        .card {
          align-content: center;
          background-color: white;
          border: 1px solid ${colors.lightGrey};
          border-radius: 8px;
          box-shadow: 0px 2px 6px 0px ${colors.darkGrey};
          display: grid;
          gap: 16px;
          height: ${cardHeight}px;
          justify-content: center;
          width: ${cardWidth}px;
        }

        .card.selected {
          border: 4px solid ${colors.blue};
          box-shadow: 0px 4px 4px 2px ${colors.darkGrey};
        }
      `}</style>
    </>
  );
}

function ShapeImage({
  color,
  shade,
  shape,
}: {
  color: Color;
  shade: Shade;
  shape: Shape;
}) {
  const { shapeId, clipPathId, width, height } = shapeImageDescriptions[shape];
  return (
    <>
      <div
        style={{
          position: 'relative',
          width,
          height,
        }}
      >
        <div
          className="full-span"
          style={{
            background: getBackground(color, shade),
            clipPath: `url(#${clipPathId})`,
          }}
        />

        <svg className="full-span">
          <use href={`#${shapeId}`} stroke={colors[color]} />
        </svg>
      </div>

      <style jsx>{`
        .full-span {
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }
      `}</style>
    </>
  );
}

const stripeWidth = 2;
const stripeGap = 3;

function getBackground(color: Color, shade: Shade) {
  const colorValue = colors[color];

  switch (shade) {
    case 'open':
      return 'none';

    case 'solid':
      return colorValue;

    case 'striped':
      return `
        repeating-linear-gradient(
          to right,
          ${colorValue} 0,
          ${colorValue} ${stripeWidth}px,
          transparent ${stripeWidth}px,
          transparent ${stripeWidth + stripeGap}px
        )
      `;
  }
}
