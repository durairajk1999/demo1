export {};

declare global {
  interface Window {
    __env: any; // whatever type you want to give. (any,number,float etc)
  }
}