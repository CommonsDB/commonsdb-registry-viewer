import { useEffect, useRef } from 'react';

/**
 * Fires `onLoadMore` whenever the returned sentinel element is visible.
 *
 * `contentSize` must change when a page of content is appended: observing an
 * element only notifies on intersection *changes*, so if the sentinel is still
 * on screen after a load (tall viewport, short page) nothing would re-fire.
 * Re-observing on each content change delivers a fresh initial notification,
 * which loads the next page until the sentinel finally leaves the viewport.
 */
export const useInfiniteScroll = (
  onLoadMore: () => void,
  isLoading: boolean,
  contentSize?: number,
) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = loaderRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { root: null, rootMargin: '20px', threshold: 0.1 },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [onLoadMore, isLoading, contentSize]);

  return loaderRef;
};
