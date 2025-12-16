import { CreateMultisigAccountParams, CreateMultisigAccountResponseData } from '../../../providers';
import { WalletResponse } from '../wallet.types';

export type CreateMultisigAccountOptions = CreateMultisigAccountParams;

export type CreateMultisigAccountResponse = WalletResponse<CreateMultisigAccountResponseData>;
