import { BroadcastTxCommitResult } from '@gnolang/tm2-js-client';

import { SignMultisigTransactionResponseData } from '../../../providers';
import { WalletResponse } from '../wallet.types';

export type BroadcastMultisigTransactionOptions = SignMultisigTransactionResponseData['result'];

export type BroadcastMultisigTransactionResponse = WalletResponse<BroadcastTxCommitResult>;
