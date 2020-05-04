import { ReactElement, cloneElement } from 'react';

import { Shape } from 'components/Card';

export function CardDefs() {
  return (
    <svg width="0" height="0">
      {(Object.keys(shapes) as Shape[]).map((shape) => (
        <clipPath key={shape} id={`clip-path-${shape}`}>
          {shapes[shape]}
        </clipPath>
      ))}

      <defs>
        {(Object.keys(shapes) as Shape[]).map((shape) =>
          cloneElement(shapes[shape], { key: shape, id: `shape-${shape}` })
        )}
      </defs>
    </svg>
  );
}

const shapes: Record<Shape, ReactElement> = {
  diamond: (
    <path
      fill="none"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M1 28L56 1l55 28-55 28z"
    />
  ),
  oval: (
    <rect
      width="107.9"
      height="50.8"
      x="695.3"
      y="-914.8"
      fill="none"
      strokeLinejoin="round"
      strokeWidth="2"
      rx="24.7"
      ry="25.4"
      transform="translate(-694 916)"
    />
  ),
  squiggle: (
    <path
      fill="none"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M28 3c17 0 25 9 38 9C81 12 89 1 94 1c8 0 9 9 9 13 0 20-15 33-34 33-14 1-20-7-30-7-17 1-17 11-29 12-5 0-9-11-9-21C1 16 10 3 28 3z"
    />
  ),
};

export const sizes: Record<Shape, { width: number; height: number }> = {
  diamond: { width: 112, height: 58.2 },
  oval: { width: 109.8, height: 52.8 },
  squiggle: { width: 103.8, height: 52.6 },
};
