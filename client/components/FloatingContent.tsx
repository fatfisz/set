import { ReactNode } from 'react';

import { translucentBlack } from 'config/colors';

export function FloatingContent({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="spacing-wrapper">
        <div className="floating-content">{children}</div>
      </div>

      <style jsx>{`
        .spacing-wrapper {
          align-items: center;
          display: flex;
          flex-direction: column;
          padding: 64px 0;
        }

        .floating-content {
          background-color: ${translucentBlack};
          border-radius: 32px;
          padding: 32px;
          min-height: 420px;
          width: 500px;
        }
      `}</style>
    </>
  );
}
