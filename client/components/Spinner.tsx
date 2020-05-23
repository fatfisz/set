export function Spinner({
  size,
  widthRatio = 0.1,
}: {
  size: number;
  widthRatio?: number;
}) {
  return (
    <>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <path
          d={`
          M ${size / 2} 0
          A ${size / 2} ${size / 2} 0 1 0 ${size} ${size / 2}
          L ${size * (1 - widthRatio)} ${size / 2}
          A ${size * (0.5 - widthRatio)} ${size * (0.5 - widthRatio)} 0 1 1 ${
            size / 2
          } ${size * widthRatio}
          Z
        `}
          fill="white"
        />
      </svg>

      <style jsx>{`
        svg {
          animation-duration: 1s;
          animation-iteration-count: infinite;
          animation-name: spin;
          animation-timing-function: linear;
          height: ${size}px;
          width: ${size}px;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
