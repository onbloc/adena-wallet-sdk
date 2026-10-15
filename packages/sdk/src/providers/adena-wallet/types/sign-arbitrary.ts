import { AdenaResponse } from '.';
import { SignedArbitraryData } from '../../../core/types/arbitrary.types';

enum SignArbitraryResponseType {
  SIGN_ARBITRARY = 'SIGN_ARBITRARY',
}

export type SignArbitraryParams = {
  signer: string;
  /**
   * Text, not bytes: the wallet displays it and `Uint8Array` does not survive
   * the JSON boundary to the extension
   */
  data: string;
};

export type SignArbitraryResponse = AdenaResponse<SignArbitraryResponseType, SignedArbitraryData>;

/**
 * Signs `data` as an ADR-036 document bound to the connected network's chain
 * id. Absent on extensions that predate the feature.
 */
export type AdenaSignArbitrary = (params: SignArbitraryParams) => Promise<SignArbitraryResponse>;
