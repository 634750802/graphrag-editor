import { useEffect, useRef } from 'react';

export function useMountSignal () {
  const acRef = useRef<AbortController>();

  useEffect(() => {
    const ac = acRef.current = new AbortController();

    return () => {
      ac.abort('component unmount');
    };
  }, []);

  return acRef.current?.signal;
}
