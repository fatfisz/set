import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { FloatingContent } from 'components/FloatingContent';
import { pageRedirectionTimeout } from 'config/pageRedirectionTimeout';

export function NotFound() {
  const router = useRouter();

  useEffect(() => {
    let didCancel = false;
    const timeoutHandle = setTimeout(() => {
      if (!didCancel) {
        router.push('/');
      }
    }, pageRedirectionTimeout);
    return () => {
      didCancel = true;
      clearTimeout(timeoutHandle);
    };
  }, []);

  return (
    <FloatingContent>
      <h1>The room does not exist</h1>
      <p>You will be redirected to the lobby in a few seconds.</p>
    </FloatingContent>
  );
}
