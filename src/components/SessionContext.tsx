import { nanoid } from 'nanoid/non-secure';
import { createContext, ReactNode, useEffect, useState } from 'react';

export const SessionContext = createContext<{
  sessionId: string;
}>({
  sessionId: '',
});

const storageIdKey = 'sessionId';

export function SessionContextProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState(
    typeof localStorage === 'undefined'
      ? ''
      : localStorage.getItem(storageIdKey) || ''
  );

  if (sessionId === '') {
    setSessionId(nanoid());
  }

  useEffect(() => {
    localStorage.setItem(storageIdKey, sessionId);
  }, [sessionId]);

  const value = {
    sessionId,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
