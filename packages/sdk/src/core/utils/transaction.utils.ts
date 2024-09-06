import { Tx } from '@gnolang/tm2-js-client';
import { TransactionMessage } from '../types';

export const defaultGasFee = {
  amount: 1000000,
  denom: 'ugnot',
};

export const defaultGasWanted = 1_000_000;

export class TransactionBuilder {
  private _messages: TransactionMessage[] = [];
  private _fees: { amount: string; denom: string }[] = [];
  private _chainId: string = '';
  private _memo: string = '';
  private _accountNumber: string = '';
  private _sequence: string = '';
  private _gasWanted: string = '';

  messages(...messages: TransactionMessage[]): TransactionBuilder {
    this._messages = messages;
    return this;
  }

  fees(...fees: { amount: number; denom: string }[]): TransactionBuilder {
    this._fees = fees.map((fee) => ({ amount: fee.amount.toString(), denom: fee.denom }));
    return this;
  }

  gasWanted(amount: number): TransactionBuilder {
    this._gasWanted = amount.toString();
    return this;
  }

  chainId(chainId: string): TransactionBuilder {
    this._chainId = chainId;
    return this;
  }

  accountNumber(accountNumber: number): TransactionBuilder {
    this._accountNumber = accountNumber.toString();
    return this;
  }

  sequence(sequence: number): TransactionBuilder {
    this._sequence = sequence.toString();
    return this;
  }

  memo(memo: string): TransactionBuilder {
    this._memo = memo;
    return this;
  }

  build(): Tx {
    const txDocument = {
      msgs: this._messages,
      fee: {
        amount: this._fees,
        gas: this._gasWanted,
      },
      chain_id: this._chainId,
      account_number: this._accountNumber,
      sequence: this._sequence,
      memo: this._memo,
    };

    return Tx.fromJSON(txDocument);
  }

  public static create(): TransactionBuilder {
    return new TransactionBuilder().gasWanted(defaultGasWanted).fees(defaultGasFee);
  }
}
