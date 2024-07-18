import { useEffect, useState } from "react";

const useLocalStorageExpiration = (
  cacheKey: string,
  onExpired: () => void
): { isEnabled: boolean; start: () => void; stop: () => void } => {
  const [isEnabled, setIsEnabled] = useState(false);

  const start = () => {
    setIsEnabled(true);
  };

  const stop = () => {
    setIsEnabled(false);
  };

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const interval = setInterval(() => {
      const cachedTimeStr = localStorage.getItem(`${cacheKey}_time`);
      if (!cachedTimeStr) {
        return;
      }

      const cachedTime = parseInt(cachedTimeStr, 10);
      const currentTime = new Date().getTime();
      const cacheExpiry = cachedTime;

      if (currentTime > cacheExpiry) {
        // Data has expired, trigger the function
        onExpired();
        // Optionally, remove the expired item from localStorage
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(`${cacheKey}_time`);
      }
    }, 1000); // Check expiration every second

    return () => clearInterval(interval);
  }, [cacheKey, isEnabled, onExpired]);

  return { isEnabled, start, stop };
};

export default useLocalStorageExpiration;
