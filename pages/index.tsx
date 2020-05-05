import { Table } from 'components/Table';
import { TableStateProvider } from 'components/TableStateContext';
import { MaybeCardDescription } from 'types/Card';

export default function Index() {
  return (
    <TableStateProvider>
      <Table cards={cards} />
    </TableStateProvider>
  );
}

const cards: MaybeCardDescription[] = [
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
