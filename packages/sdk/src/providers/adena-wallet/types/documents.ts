import { AdenaResponse, TransactionParams } from '.';

enum SignDocumentResponseType {
  SIGN_DOCUMENT = 'SIGN_DOCUMENT',
}

type SignDocumentResponseData = {
  encodedTransaction: string;
};

type SignDocumentResponse = AdenaResponse<SignDocumentResponseType, SignDocumentResponseData>;

export type AdenaSignDocument = (params: TransactionParams) => Promise<SignDocumentResponse>;
