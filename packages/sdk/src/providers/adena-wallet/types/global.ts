import { AdenaWallet } from './adena';

declare global {
  interface Window {
    adena: AdenaWallet | undefined;
  }
}
