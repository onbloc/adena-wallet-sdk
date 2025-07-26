import { Any, defaultTxFee } from '@gnolang/gno-js-client';
import { Tx, TxFee } from '@gnolang/tm2-js-client';

import { TransactionMessage } from '../types';
import { encodeTransactionMessage } from './transaction-message.utils';

export const defaultGasWanted = 10_000_000;

export class TransactionBuilder {
  private _messages: TransactionMessage[] = [];
  private _memo: string = '';
  private _gasWanted: number = defaultGasWanted;
  private _gasFee: string = defaultTxFee;

  messages(...messages: TransactionMessage[]): TransactionBuilder {
    this._messages = messages;
    return this;
  }

  fee(amount: number, denom: string): TransactionBuilder {
    this._gasFee = `${amount}${denom}`;
    return this;
  }

  gasWanted(amount: number): TransactionBuilder {
    this._gasWanted = amount;
    return this;
  }

  memo(memo: string): TransactionBuilder {
    this._memo = memo;
    return this;
  }

  private get txMessages(): Any[] {
    return this._messages.map((message) => {
      return Any.create({
        type_url: message.type,
        value: encodeTransactionMessage(message),
      });
    });
  }

  private get txFee(): TxFee {
    return TxFee.create({
      gas_fee: this._gasFee,
      gas_wanted: this._gasWanted,
    });
  }

  build(): Tx {
    return {
      messages: this.txMessages,
      fee: this.txFee,
      memo: this._memo,
      signatures: [],
    };
  }

  public static create(): TransactionBuilder {
    const builder = new TransactionBuilder();

    return builder.gasWanted(defaultGasWanted);
  }
}
