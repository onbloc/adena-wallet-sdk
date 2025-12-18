import { CreateMultisigTransactionParams, CreateMultisigTransactionResponseData } from '../../../providers';
import { WalletResponse } from '../wallet.types';

export type CreateMultisigTransactionOptions = CreateMultisigTransactionParams;

export type CreateMultisigTransactionResponse = WalletResponse<CreateMultisigTransactionResponseData>;
