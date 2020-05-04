import { Table, MaybeCard } from 'components/Table';

export default function Index() {
  return <Table cards={cards} />;
}

const cards: MaybeCard[] = [
  { color: 'green', number: 1, shade: 'open', shape: 'diamond' },
  // { color: 'purple', number: 2, shade: 'striped', shape: 'squiggle' },
  undefined,
  { color: 'red', number: 3, shade: 'solid', shape: 'oval' },
  // { color: 'green', number: 1, shade: 'open', shape: 'diamond' },
  // { color: 'purple', number: 2, shade: 'striped', shape: 'squiggle' },
  // { color: 'red', number: 3, shade: 'solid', shape: 'oval' },
  undefined,
  undefined,
  undefined,
  { color: 'green', number: 1, shade: 'open', shape: 'diamond' },
  // { color: 'purple', number: 2, shade: 'striped', shape: 'squiggle' },
  undefined,
  { color: 'red', number: 3, shade: 'solid', shape: 'oval' },
  { color: 'green', number: 1, shade: 'open', shape: 'diamond' },
  // { color: 'purple', number: 2, shade: 'striped', shape: 'squiggle' },
  undefined,
  { color: 'red', number: 3, shade: 'solid', shape: 'oval' },
  { color: 'red', number: 3, shade: 'solid', shape: 'oval' },
];
