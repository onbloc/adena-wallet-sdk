export * from './core';
export * from './providers';

/**
 * `core/types/methods` and `providers/adena-wallet/types` both declare these
 * names. The bare name is the SDK-level response that `AdenaSDK` returns; the
 * raw `window.adena` shape keeps an `Adena` prefix.
 */
export type {
  AddEstablishResponse,
  CreateMultisigAccountResponse,
  CreateMultisigTransactionResponse,
  SignMultisigTransactionResponse,
} from './core/types/methods';

export type {
  AddEstablishResponse as AdenaAddEstablishResponse,
  CreateMultisigAccountResponse as AdenaCreateMultisigAccountResponse,
  CreateMultisigTransactionResponse as AdenaCreateMultisigTransactionResponse,
  SignMultisigTransactionResponse as AdenaSignMultisigTransactionResponse,
} from './providers/adena-wallet/types';
