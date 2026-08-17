import { useEffect, useRef, useState } from 'react';

interface IUseCountUpOptions {
  durationMs?: number;
}

/**
 * Animates a numeric value from its previous value to the new target with an
 * ease-out cubic curve. Used by KPI cards where a smooth count-up reads as
 * "live data".
 */
export const useCountUp = (
  target: number,
  { durationMs = 600 }: IUseCountUpOptions = {},
): number => {
  const [shown, setShown] = useState<number>(target);
  const fromRef = useRef<number>(target);

  useEffect(() => {
    const from = fromRef.current;
    const to = target;
    if (from === to) return;

    let raf = 0;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = from + (to - from) * eased;
      setShown(value);
      // Track the currently shown value so a target change mid-animation
      // resumes from here instead of jumping back to the old start point.
      fromRef.current = value;
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return shown;
};
