import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';

import { SocketContext } from 'components/SocketContext';
import { Spinner } from 'components/Spinner';
import * as colors from 'config/colors';

export function ServerConnectivityIndicator() {
  const { ready } = useContext(SocketContext);
  const [clientRendered, setClientRendered] = useState(false);

  useEffect(() => {
    const handle = setTimeout(() => setClientRendered(true), 1000);
    return () => {
      clearTimeout(handle);
    };
  }, []);

  return (
    <>
      <div
        className={classNames('backdrop', { hidden: ready || !clientRendered })}
      >
        <h1>Connecting</h1>
        <Spinner size={32} />
      </div>

      <style jsx>{`
        .backdrop {
          align-content: center;
          background-color: ${colors.translucentBlack};
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(2, max-content);
          height: 100%;
          justify-content: center;
          left: 0;
          opacity: 1;
          position: fixed;
          user-select: none;
          top: 0;
          transform: scale(1, 1);
          transition-delay: 0s, 0s;
          transition-duration: 200ms, 0s;
          transition-property: opacity, transform;
          width: 100%;
        }

        .hidden {
          opacity: 0;
          transform: scale(0, 0);
          transition-delay: 0s, 200ms;
        }
      `}</style>
    </>
  );
}
