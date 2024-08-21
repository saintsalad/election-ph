const IS_SERVER = typeof window === "undefined";

const isIOS = (): boolean => {
  if (IS_SERVER) return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
  );
};

const isAndroid = (): boolean => {
  if (IS_SERVER) return false;
  return /android/i.test(navigator.userAgent);
};

const isChrome = (): boolean => {
  if (IS_SERVER) return false;
  const userAgent = navigator.userAgent;
  const vendor = navigator.vendor;
  return (
    /CriOS/.test(userAgent) ||
    (/Chrome/.test(userAgent) && /Google Inc/.test(vendor))
  );
};

const isSafari = (): boolean => {
  if (IS_SERVER) return false;
  const userAgent = navigator.userAgent;
  return /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
};

const getBrowserType = (): string => {
  if (isChrome()) return "Chrome";
  if (isSafari()) return "Safari";
  if (isIOS()) return "iOS Browser";
  if (isAndroid()) return "Android Browser";
  return "Unknown";
};

const getDeviceType = (): string => {
  if (isIOS()) return "iOS";
  if (isAndroid()) return "Android";
  return "Desktop";
};

export function useBrowserAndDevice() {
  const browserType = getBrowserType().toLowerCase();
  const deviceType = getDeviceType().toLowerCase();

  return { browserType, deviceType };
}
