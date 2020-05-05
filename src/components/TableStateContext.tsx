import equal from 'fast-deep-equal';
import produce, { Draft } from 'immer';
import { createContext, ReactNode, useCallback, useReducer } from 'react';

import { CardDescription } from 'types/Card';

interface TableState {
  selected: Readonly<CardDescription[]>;
}

type TableStateAction =
  | { type: 'select'; payload: CardDescription }
  | { type: 'reset' };

export const TableStateContext = createContext<{
  checkIsSelected(card: CardDescription): boolean;
  select(card: CardDescription): void;
  reset(): void;
}>({
  checkIsSelected: () => false,
  select: () => {},
  reset: () => {},
});

const initialState: TableState = {
  selected: [],
};

export function TableStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tableStateReducer, initialState);
  const value = {
    checkIsSelected: useCallback(
      (cardQuery: CardDescription) =>
        state.selected.some((card) => equal(card, cardQuery)),
      [state.selected]
    ),
    select: useCallback(
      (card: CardDescription) => dispatch({ type: 'select', payload: card }),
      []
    ),
    reset: useCallback(() => dispatch({ type: 'reset' }), []),
  };

  return (
    <TableStateContext.Provider value={value}>
      {children}
    </TableStateContext.Provider>
  );
}

const tableStateReducer = produce(
  (state: Draft<TableState>, action: TableStateAction) => {
    switch (action.type) {
      case 'select':
        if (!state.selected.some((card) => equal(card, action.payload))) {
          state.selected.push(action.payload);
        }
        return;

      case 'reset':
        state.selected = [];
        return;
    }
  }
);
