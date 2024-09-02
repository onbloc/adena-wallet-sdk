import { AdenaWallet } from '.';

declare global {
  interface Window {
    adena: AdenaWallet | undefined;
  }
}
