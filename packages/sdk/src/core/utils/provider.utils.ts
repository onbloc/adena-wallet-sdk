import { GnoSocialWalletProvider, GnoWalletProvider } from '../../providers';
import { TM2WalletProvider, WalletProvider } from '../providers';

export function isTM2WalletProvider(wallet: WalletProvider): wallet is TM2WalletProvider {
  return wallet instanceof GnoWalletProvider || wallet instanceof GnoSocialWalletProvider;
}
