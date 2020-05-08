import { Card } from 'components/Card';
import { Title } from 'components/Title';

export default function Cards() {
  return (
    <>
      <Title title="Cards" />

      {Array.from({ length: 3 ** 4 }, (_value, index) => (
        <div
          key={index}
          style={{ display: 'inline-block', verticalAlign: 'top' }}
        >
          {index}: <Card card={index} />
        </div>
      ))}
    </>
  );
}
