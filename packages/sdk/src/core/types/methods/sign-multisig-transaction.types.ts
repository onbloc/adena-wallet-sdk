import { SignMultisigTransactionResponseData } from '../../../providers';
import { WalletResponse } from '../wallet.types';

export type SignMultisigTransactionOptions = SignMultisigTransactionResponseData['result'];

export type SignMultisigTransactionResponse = WalletResponse<SignMultisigTransactionResponseData>;
