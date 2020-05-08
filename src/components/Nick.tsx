import { useContext } from 'react';

import { SocketContext } from 'components/SocketContext';

export function Nick() {
  const { name } = useContext(SocketContext);
  return <input readOnly value={name} />;
}
