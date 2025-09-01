import { Any, MsgAddPackage, MsgCall, MsgEndpoint, MsgRun, MsgSend } from '@gnolang/gno-js-client';
import { AddPackageMessage, MsgCallMessage, MsgRunMessage, MsgSendMessage, TransactionMessage } from '../types';

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

export function encodeTransactionMessage(message: TransactionMessage): Uint8Array {
  if (isAddPackageMessage(message)) {
    return MsgAddPackage.encode(message.value).finish();
  }

  if (isMsgCallMessage(message)) {
    return MsgCall.encode(message.value).finish();
  }

  if (isMsgSendMessage(message)) {
    return MsgSend.encode(message.value).finish();
  }

  if (isMsgRunMessage(message)) {
    return MsgRun.encode(message.value).finish();
  }

  throw new Error('Unknown message type');
}

export function decodeTransactionMessage(message: Any): TransactionMessage {
  if (message.type_url === MsgEndpoint.MSG_ADD_PKG) {
    return {
      type: MsgEndpoint.MSG_ADD_PKG,
      value: MsgAddPackage.decode(message.value),
    };
  }

  if (message.type_url === MsgEndpoint.MSG_CALL) {
    return {
      type: MsgEndpoint.MSG_CALL,
      value: MsgCall.decode(message.value),
    };
  }

  if (message.type_url === MsgEndpoint.MSG_SEND) {
    return {
      type: MsgEndpoint.MSG_SEND,
      value: MsgSend.decode(message.value),
    };
  }

  if (message.type_url === MsgEndpoint.MSG_RUN) {
    return {
      type: MsgEndpoint.MSG_RUN,
      value: MsgRun.decode(message.value),
    };
  }

  throw new Error('Unknown message type');
}

function isAddPackageMessage(message: TransactionMessage): message is AddPackageMessage {
  return message.type === MsgEndpoint.MSG_ADD_PKG;
}

function isMsgCallMessage(message: TransactionMessage): message is MsgCallMessage {
  return message.type === MsgEndpoint.MSG_CALL;
}

function isMsgSendMessage(message: TransactionMessage): message is MsgSendMessage {
  return message.type === MsgEndpoint.MSG_SEND;
}

function isMsgRunMessage(message: TransactionMessage): message is MsgRunMessage {
  return message.type === MsgEndpoint.MSG_RUN;
}
