import { Card } from 'components/Card';
import { CardDefs } from 'components/CardDefs';

export default function Index() {
  return (
    <div>
      <CardDefs />
      <Card color="green" number={1} shade="open" shape="diamond" />
      <Card color="purple" number={2} shade="striped" shape="squiggle" />
      <Card color="red" number={3} shade="solid" shape="oval" />
    </div>
  );
}
