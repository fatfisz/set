import { ReactElement, cloneElement, Fragment } from 'react';

import { Shape } from 'config/card';

interface ShapeImageDescription {
  shapeId: string;
  clipPathId: string;
  element: ReactElement;
  width: number;
  height: number;
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

const sizes: Record<Shape, { width: number; height: number }> = {
  diamond: { width: 112, height: 58.2 },
  oval: { width: 109.8, height: 52.8 },
  squiggle: { width: 103.8, height: 52.6 },
};

export const shapeImageDescriptions = Object.fromEntries(
  (Object.entries(shapes) as [Shape, ReactElement][]).map(
    getShapeImageDescription
  )
) as Record<Shape, ShapeImageDescription>;

export function CardDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{
        // The svg element generates a new line, which has line-height, so let's
        // just take it out of the flow
        position: 'absolute',
      }}
    >
      {Object.values(shapeImageDescriptions).map(
        ({ shapeId, clipPathId, element }, index) => (
          <Fragment key={index}>
            <defs>{cloneElement(element, { id: shapeId })}</defs>
            <clipPath id={clipPathId}>{element}</clipPath>
          </Fragment>
        )
      )}
    </svg>
  );
}

function getShapeImageDescription([shape, element]: [Shape, ReactElement]): [
  Shape,
  ShapeImageDescription
] {
  return [
    shape,
    {
      shapeId: `shape-${shape}`,
      clipPathId: `clip-path-${shape}`,
      element,
      ...sizes[shape],
    },
  ];
}
