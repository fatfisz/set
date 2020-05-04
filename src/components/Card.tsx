import { shapeImageDescriptions } from 'components/CardDefs';
import { Color, Number, Shade, Shape } from 'config/card';

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
  return (
    <div className="card">
      {Array.from({ length: number }, (_value, key) => (
        <ShapeImage key={key} color={color} shade={shade} shape={shape} />
      ))}

      <style jsx>{`
        .card {
          align-items: center;
          border: 2px solid #ccc;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 264px;
          width: 167px;
        }
      `}</style>
    </div>
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
    <div
      className="symbol"
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

      <style jsx>{`
        .symbol + .symbol {
          margin-top: 20px;
        }

        .full-span {
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }
      `}</style>
    </div>
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

const colors: Record<Color, string> = {
  red: '#fd0484',
  green: '#69db71',
  purple: '#7f7cd4',
};
