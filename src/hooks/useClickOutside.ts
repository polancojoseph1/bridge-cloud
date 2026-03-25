import { useEffect, RefObject } from 'react';

/**
 * A custom hook that handles clicks outside a specified element and 'Escape' key presses.
 *
 * @param ref - The React ref object pointing to the element to detect outside clicks for.
 * @param handler - The callback function to execute when a click outside or 'Escape' key is detected.
 * @param enabled - A boolean indicating whether the listeners should be active. Defaults to true.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handler();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, handler, enabled]);
}
