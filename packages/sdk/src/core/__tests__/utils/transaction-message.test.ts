import {
  Any,
  MsgCreateSession,
  MsgEnablePackage,
  MsgEndpoint,
  MsgRejectPackage,
  MsgRevokeAllSessions,
  MsgRevokeSession,
} from '@gnolang/gno-js-client';
import { secp256k1PubKeyToAny } from '@gnolang/gno-js-client';

import { TransactionMessage } from '../../types';
import {
  decodeTransactionMessage,
  encodeTransactionMessage,
  makeAddPackageMessage,
  makeMsgCallMessage,
  makeMsgCreateSessionMessage,
  makeMsgEnablePackageMessage,
  makeMsgRejectPackageMessage,
  makeMsgRevokeAllSessionsMessage,
  makeMsgRevokeSessionMessage,
  makeMsgRunMessage,
  makeMsgSendMessage,
} from '../../utils/transaction-message.utils';

const CALLER = 'g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5';
const SESSION_KEY = secp256k1PubKeyToAny(new Uint8Array(33).fill(2));

/** Round-trips a message through the Any envelope the transaction builder uses. */
function roundTrip(message: TransactionMessage): TransactionMessage {
  return decodeTransactionMessage(
    Any.create({
      type_url: message.type,
      value: encodeTransactionMessage(message),
    })
  );
}

describe('transaction message encoding', () => {
  it('round-trips the four legacy message types', () => {
    const messages: TransactionMessage[] = [
      makeMsgSendMessage({ from_address: CALLER, to_address: CALLER, amount: '1ugnot' }),
      makeMsgCallMessage({
        caller: CALLER,
        send: '',
        max_deposit: '',
        pkg_path: 'gno.land/r/demo/boards',
        func: 'CreateBoard',
        args: ['dev'],
      }),
      makeAddPackageMessage({
        creator: CALLER,
        send: '',
        max_deposit: '',
        package: { name: 'demo', path: 'gno.land/r/demo/x', files: [{ name: 'x.gno', body: 'package demo' }] },
      }),
      makeMsgRunMessage({
        caller: CALLER,
        send: '',
        max_deposit: '',
        package: { name: 'main', path: '', files: [{ name: 'main.gno', body: 'package main' }] },
      }),
    ];

    for (const message of messages) {
      expect(roundTrip(message)).toEqual(message);
    }
  });

  it('round-trips the package approval message types', () => {
    const enablePackage = makeMsgEnablePackageMessage(
      MsgEnablePackage.create({
        approver: CALLER,
        pkg_path: 'gno.land/r/demo/x',
        pkg_hash: 'abc123',
        pkg_height: 42n,
      })
    );
    const rejectPackage = makeMsgRejectPackageMessage(
      MsgRejectPackage.create({ sender: CALLER, pkg_path: 'gno.land/r/demo/x' })
    );

    expect(enablePackage.type).toBe(MsgEndpoint.MSG_ENABLE_PKG);
    expect(rejectPackage.type).toBe(MsgEndpoint.MSG_REJECT_PKG);
    expect(roundTrip(enablePackage)).toEqual(enablePackage);
    expect(roundTrip(rejectPackage)).toEqual(rejectPackage);
  });

  it('round-trips the account session message types', () => {
    const createSession = makeMsgCreateSessionMessage(
      MsgCreateSession.create({
        creator: CALLER,
        session_key: SESSION_KEY,
        expires_at: 1893456000n,
        allow_paths: ['gno.land/r/demo/x'],
        spend_limit: '1000ugnot',
        spend_period: 3600n,
      })
    );
    const revokeSession = makeMsgRevokeSessionMessage(
      MsgRevokeSession.create({ creator: CALLER, session_key: SESSION_KEY })
    );
    const revokeAll = makeMsgRevokeAllSessionsMessage(MsgRevokeAllSessions.create({ creator: CALLER }));

    expect(createSession.type).toBe(MsgEndpoint.MSG_CREATE_SESSION);
    expect(revokeSession.type).toBe(MsgEndpoint.MSG_REVOKE_SESSION);
    expect(revokeAll.type).toBe(MsgEndpoint.MSG_REVOKE_ALL_SESSIONS);
    expect(roundTrip(createSession)).toEqual(createSession);
    expect(roundTrip(revokeSession)).toEqual(revokeSession);
    expect(roundTrip(revokeAll)).toEqual(revokeAll);
  });

  it('rejects an unknown type_url on decode', () => {
    expect(() => decodeTransactionMessage(Any.create({ type_url: '/vm.m_unknown', value: new Uint8Array() }))).toThrow(
      'Unknown message type'
    );
  });
});
