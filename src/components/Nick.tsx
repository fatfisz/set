import { useContext, useState } from 'react';

import { SocketContext } from 'components/SocketContext';

export function Nick() {
  const { name, setName } = useContext(SocketContext);
  const [localName, setLocalName] = useState(name);
  return (
    <>
      <input
        value={localName}
        onChange={({ target: { value } }) => setLocalName(value)}
      />
      <button onClick={() => setName(localName)}>Change name</button>
    </>
  );
}
