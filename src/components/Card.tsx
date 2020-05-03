import { sizes } from 'components/CardDefs';

export type Color = 'red' | 'green' | 'purple';
export type Number = 1 | 2 | 3;
export type Shade = 'solid' | 'striped' | 'open';
export type Shape = 'diamond' | 'oval' | 'squiggle';

interface Props {
  color: Color;
  number: Number;
  shade: Shade;
  shape: Shape;
}

export function Card(props: Props) {
  const { color, number, shade, shape } = props;

  const svgImage = (
    <div
      className="symbol"
      style={{
        position: 'relative',
        ...sizes[shape],
      }}
    >
      <div
        className="full-span"
        style={{
          background: getBackground(color, shade),
          clipPath: `url(#clip-path-${shape})`,
        }}
      />

      <svg className="full-span">
        <use href={`#shape-${shape}`} stroke={colors[color]} />
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

  return (
    <div className="card">
      {Array.from({ length: number }, () => svgImage)}

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
