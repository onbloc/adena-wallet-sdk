import {
  CreateMultisigTransactionResponseData,
  MultisigSignature,
  SignMultisigTransactionResponseData,
} from '../../../providers';
import { WalletResponse } from '../wallet.types';

export type SignMultisigTransactionOptions = {
  multisigDocument: CreateMultisigTransactionResponseData;
  multisigSignatures?: MultisigSignature[];
};

export type SignMultisigTransactionResponse = WalletResponse<SignMultisigTransactionResponseData>;
