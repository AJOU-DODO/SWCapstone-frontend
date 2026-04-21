export {};
declare global {
  interface Window {
    AndroidBridge: {
      getNestIds: () => string;
      getAccessToken: () => string;
    };
  }
}
