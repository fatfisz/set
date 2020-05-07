import produce, { Draft } from 'immer';
import { createContext, ReactNode, useCallback, useReducer } from 'react';

interface TableState {
  selected: Readonly<number[]>;
}

type TableStateAction =
  | {
      type: 'select';
      payload: number;
    }
  | { type: 'reset' };

export const TableStateContext = createContext<{
  checkIsSelected(card: number): boolean;
  select(card: number): void;
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
      (card: number) => state.selected.includes(card),
      [state.selected]
    ),
    select: useCallback(
      (card: number) => dispatch({ type: 'select', payload: card }),
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
        if (!state.selected.includes(action.payload)) {
          state.selected.push(action.payload);
        }
        return;

      case 'reset':
        state.selected = [];
        return;
    }
  }
);
