import { useCallback, useState } from "react";

import { useIsomorphicLayoutEffect } from "usehooks-ts";

type UseMediaQueryOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === "undefined";

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = useCallback(
    (query: string): boolean => {
      if (IS_SERVER) {
        return defaultValue;
      }
      return window.matchMedia(query).matches;
    },
    [defaultValue]
  );

  const [matches, setMatches] = useState<boolean>(defaultValue);

  // Handles the change event of the media query.
  const handleChange = useCallback(() => {
    setMatches(getMatches(query));
  }, [getMatches, query]);

  useIsomorphicLayoutEffect(() => {
    handleChange();

    const matchMedia = window.matchMedia(query);

    // Use deprecated `addListener` and `removeListener` to support Safari < 14 (#135)
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
  }, [query, handleChange]);

  return matches;
}
