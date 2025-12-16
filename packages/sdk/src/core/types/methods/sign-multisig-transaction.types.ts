import { CreateMultisigTransactionResponseData, SignMultisigTransactionResponseData } from '../../../providers';
import { WalletResponse } from '../wallet.types';

export type SignMultisigTransactionOptions = CreateMultisigTransactionResponseData;

export type SignMultisigTransactionResponse = WalletResponse<SignMultisigTransactionResponseData>;
