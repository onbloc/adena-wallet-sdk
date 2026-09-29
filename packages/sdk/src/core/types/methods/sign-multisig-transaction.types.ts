import {
  MultisigSignature,
  MultisigTransactionDocument,
  SignMultisigTransactionResponseData,
} from '../../../providers';
import { WalletResponse } from '../wallet.types';

export type SignMultisigTransactionOptions = {
  multisigDocument: MultisigTransactionDocument;
  multisigSignatures?: MultisigSignature[];
};

export type SignMultisigTransactionResponse = WalletResponse<SignMultisigTransactionResponseData>;
