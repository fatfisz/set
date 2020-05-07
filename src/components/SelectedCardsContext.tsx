import produce, { Draft } from 'immer';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import { SocketContext } from 'components/SocketContext';

type SelectedCards = Readonly<number[]>;

type SelectedCardsAction =
  | {
      type: 'select';
      payload: number;
    }
  | { type: 'reset' };

export const SelectedCardsContext = createContext<{
  checkIsSelected(card: number): boolean;
  select(card: number): void;
  reset(): void;
}>({
  checkIsSelected: () => false,
  select: () => {},
  reset: () => {},
});

const initialState: SelectedCards = [];

export function SelectedCardsProvider({ children }: { children: ReactNode }) {
  const { selectSet } = useContext(SocketContext);
  const [state, dispatch] = useReducer(selectedCardsReducer, initialState);
  const value = {
    checkIsSelected: useCallback((card: number) => state.includes(card), [
      state,
    ]),
    select: useCallback(
      (card: number) => dispatch({ type: 'select', payload: card }),
      []
    ),
    reset: useCallback(() => dispatch({ type: 'reset' }), []),
  };

  useEffect(() => {
    if (state.length !== 3) {
      return;
    }

    selectSet(state);
    dispatch({ type: 'reset' });
  }, [state.length]);

  return (
    <SelectedCardsContext.Provider value={value}>
      {children}
    </SelectedCardsContext.Provider>
  );
}

const selectedCardsReducer = produce(
  (state: Draft<SelectedCards>, action: SelectedCardsAction) => {
    switch (action.type) {
      case 'select':
        if (!state.includes(action.payload)) {
          state.push(action.payload);
        }
        return;

      case 'reset':
        return [] as number[];
    }
  }
);
