export type Color = 'red' | 'green' | 'purple';

export type Number = 1 | 2 | 3;

export type Shade = 'solid' | 'striped' | 'open';

export type Shape = 'diamond' | 'oval' | 'squiggle';

export interface CardDescription {
  color: Color;
  number: Number;
  shade: Shade;
  shape: Shape;
}

export type MaybeCardDescription = CardDescription | undefined;
