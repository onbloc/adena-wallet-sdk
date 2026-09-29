import {
  Any,
  MsgAddPackage,
  MsgCall,
  MsgCreateSession,
  MsgEnablePackage,
  MsgEndpoint,
  MsgRejectPackage,
  MsgRevokeAllSessions,
  MsgRevokeSession,
  MsgRun,
  MsgSend,
} from '@gnolang/gno-js-client';
import {
  AddPackageMessage,
  MsgCallMessage,
  MsgCreateSessionMessage,
  MsgEnablePackageMessage,
  MsgRejectPackageMessage,
  MsgRevokeAllSessionsMessage,
  MsgRevokeSessionMessage,
  MsgRunMessage,
  MsgSendMessage,
  TransactionMessage,
} from '../types';

export function makeAddPackageMessage(value: MsgAddPackage): AddPackageMessage {
  return {
    type: MsgEndpoint.MSG_ADD_PKG,
    value,
  };
}

export function makeMsgCallMessage(value: MsgCall): MsgCallMessage {
  return {
    type: MsgEndpoint.MSG_CALL,
    value,
  };
}

export function makeMsgSendMessage(value: MsgSend): MsgSendMessage {
  return {
    type: MsgEndpoint.MSG_SEND,
    value,
  };
}

export function makeMsgRunMessage(value: MsgRun): MsgRunMessage {
  return {
    type: MsgEndpoint.MSG_RUN,
    value,
  };
}

export function makeMsgEnablePackageMessage(value: MsgEnablePackage): MsgEnablePackageMessage {
  return {
    type: MsgEndpoint.MSG_ENABLE_PKG,
    value,
  };
}

export function makeMsgRejectPackageMessage(value: MsgRejectPackage): MsgRejectPackageMessage {
  return {
    type: MsgEndpoint.MSG_REJECT_PKG,
    value,
  };
}

export function makeMsgCreateSessionMessage(value: MsgCreateSession): MsgCreateSessionMessage {
  return {
    type: MsgEndpoint.MSG_CREATE_SESSION,
    value,
  };
}

export function makeMsgRevokeSessionMessage(value: MsgRevokeSession): MsgRevokeSessionMessage {
  return {
    type: MsgEndpoint.MSG_REVOKE_SESSION,
    value,
  };
}

export function makeMsgRevokeAllSessionsMessage(value: MsgRevokeAllSessions): MsgRevokeAllSessionsMessage {
  return {
    type: MsgEndpoint.MSG_REVOKE_ALL_SESSIONS,
    value,
  };
}

export function encodeTransactionMessage(message: TransactionMessage): Uint8Array {
  switch (message.type) {
    case MsgEndpoint.MSG_ADD_PKG:
      return MsgAddPackage.encode(message.value).finish();
    case MsgEndpoint.MSG_CALL:
      return MsgCall.encode(message.value).finish();
    case MsgEndpoint.MSG_SEND:
      return MsgSend.encode(message.value).finish();
    case MsgEndpoint.MSG_RUN:
      return MsgRun.encode(message.value).finish();
    case MsgEndpoint.MSG_ENABLE_PKG:
      return MsgEnablePackage.encode(message.value).finish();
    case MsgEndpoint.MSG_REJECT_PKG:
      return MsgRejectPackage.encode(message.value).finish();
    case MsgEndpoint.MSG_CREATE_SESSION:
      return MsgCreateSession.encode(message.value).finish();
    case MsgEndpoint.MSG_REVOKE_SESSION:
      return MsgRevokeSession.encode(message.value).finish();
    case MsgEndpoint.MSG_REVOKE_ALL_SESSIONS:
      return MsgRevokeAllSessions.encode(message.value).finish();
    default:
      throw new Error('Unknown message type');
  }
}

export function decodeTransactionMessage(message: Any): TransactionMessage {
  switch (message.type_url) {
    case MsgEndpoint.MSG_ADD_PKG:
      return {
        type: MsgEndpoint.MSG_ADD_PKG,
        value: MsgAddPackage.decode(message.value),
      };
    case MsgEndpoint.MSG_CALL:
      return {
        type: MsgEndpoint.MSG_CALL,
        value: MsgCall.decode(message.value),
      };
    case MsgEndpoint.MSG_SEND:
      return {
        type: MsgEndpoint.MSG_SEND,
        value: MsgSend.decode(message.value),
      };
    case MsgEndpoint.MSG_RUN:
      return {
        type: MsgEndpoint.MSG_RUN,
        value: MsgRun.decode(message.value),
      };
    case MsgEndpoint.MSG_ENABLE_PKG:
      return {
        type: MsgEndpoint.MSG_ENABLE_PKG,
        value: MsgEnablePackage.decode(message.value),
      };
    case MsgEndpoint.MSG_REJECT_PKG:
      return {
        type: MsgEndpoint.MSG_REJECT_PKG,
        value: MsgRejectPackage.decode(message.value),
      };
    case MsgEndpoint.MSG_CREATE_SESSION:
      return {
        type: MsgEndpoint.MSG_CREATE_SESSION,
        value: MsgCreateSession.decode(message.value),
      };
    case MsgEndpoint.MSG_REVOKE_SESSION:
      return {
        type: MsgEndpoint.MSG_REVOKE_SESSION,
        value: MsgRevokeSession.decode(message.value),
      };
    case MsgEndpoint.MSG_REVOKE_ALL_SESSIONS:
      return {
        type: MsgEndpoint.MSG_REVOKE_ALL_SESSIONS,
        value: MsgRevokeAllSessions.decode(message.value),
      };
    default:
      throw new Error('Unknown message type');
  }
}
