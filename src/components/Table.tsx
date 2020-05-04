import { Card } from 'components/Card';
import { Color, Number, Shade, Shape } from 'config/card';

export function Table() {
  const cards: {
    color: Color;
    number: Number;
    shade: Shade;
    shape: Shape;
  }[] = [
    { color: 'green', number: 1, shade: 'open', shape: 'diamond' },
    { color: 'purple', number: 2, shade: 'striped', shape: 'squiggle' },
    { color: 'red', number: 3, shade: 'solid', shape: 'oval' },
    { color: 'green', number: 1, shade: 'open', shape: 'diamond' },
    { color: 'purple', number: 2, shade: 'striped', shape: 'squiggle' },
    { color: 'red', number: 3, shade: 'solid', shape: 'oval' },
    { color: 'green', number: 1, shade: 'open', shape: 'diamond' },
    { color: 'purple', number: 2, shade: 'striped', shape: 'squiggle' },
    { color: 'red', number: 3, shade: 'solid', shape: 'oval' },
    { color: 'green', number: 1, shade: 'open', shape: 'diamond' },
    { color: 'purple', number: 2, shade: 'striped', shape: 'squiggle' },
    { color: 'red', number: 3, shade: 'solid', shape: 'oval' },
  ];
  return (
    <div className="table">
      {cards.map((cardProps, index) => (
        <Card key={index} {...cardProps} />
      ))}

      <style jsx>{`
        .table {
          align-content: center;
          display: grid;
          gap: 32px;
          grid-template-columns: repeat(4, max-content);
          justify-content: center;

          height: 100%;
          left: 0;
          position: fixed;
          top: 0;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
