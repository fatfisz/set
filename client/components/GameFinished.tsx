import classNames from 'classnames';
import { useContext } from 'react';

import { SocketContext } from 'components/SocketContext';
import * as colors from 'config/colors';

export function GameFinished() {
  const { roomState } = useContext(SocketContext);
  return (
    <>
      <div
        className={classNames('backdrop', {
          finished: roomState?.isFinished,
        })}
      >
        <h1>The game has finished!</h1>
        <Scores />
      </div>

      <style jsx>{`
        .backdrop {
          align-content: center;
          background-color: ${colors.translucentBlack};
          display: grid;
          gap: 16px;
          grid-template-rows: repeat(auto-fit, minmax(0, max-content));
          height: 100%;
          justify-content: center;
          left: 0;
          opacity: 0;
          position: fixed;
          user-select: none;
          top: 0;
          transform: scale(0, 0);
          width: 100%;
        }

        .finished {
          animation-duration: 400ms;
          animation-fill-mode: forwards;
          animation-name: fade-in;
        }

        @keyframes fade-in {
          0% {
            transform: scale(1, 1);
          }
          to {
            opacity: 1;
            transform: scale(1, 1);
          }
        }
      `}</style>
    </>
  );
}

function Scores() {
  const { roomState } = useContext(SocketContext);

  if (!roomState) {
    return null;
  }

  const maxScore = roomState.scores[0].score;
  const winners = roomState.scores.filter(({ score }) => score === maxScore);

  if (winners.length === 1) {
    return <h2>The winner is: {winners[0].name}</h2>;
  }
  return (
    <>
      <h2>There is a tie between:</h2>
      <ul>
        {winners.map(({ name }) => (
          <li>{name}</li>
        ))}
      </ul>
    </>
  );
}
