export const trackEvent = (name: string, params?: any) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", name, params);
  }
};