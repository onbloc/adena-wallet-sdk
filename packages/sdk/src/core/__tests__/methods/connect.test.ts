import { mockConnectionManager } from '../../__mocks__/mock-connection-manager';
import { defineGlobalMock } from '../../__mocks__/mock-global';
import { mockWalletProvider } from '../../__mocks__/mock-wallet-provider';
import { ConnectionManager } from '../../connection';
import { connect } from '../../methods';
import { ConnectOptions } from '../../types/methods';
import { isTM2WalletProvider } from '../../utils/provider.utils';

jest.mock('../../utils/provider.utils', () => ({
  isTM2WalletProvider: jest.fn(),
}));

describe('connect', () => {
  afterEach(() => {
    defineGlobalMock();
    jest.clearAllMocks();
  });

  it('should call connectWallet successfully', async () => {
    await connect(mockConnectionManager as unknown as ConnectionManager);

    expect(mockConnectionManager.connectWallet).toHaveBeenCalled();
  });

  it('should open wallet download link if connection fails and wallet provider is not TM2', async () => {
    const mockError = new Error('Connection failed');
    mockConnectionManager.connectWallet.mockRejectedValue(mockError);
    mockConnectionManager.getWalletProvider.mockReturnValueOnce(mockWalletProvider);
    (isTM2WalletProvider as unknown as jest.Mock).mockReturnValue(false);

    const walletDownloadUrl = 'https://wallet-download-url.com';
    const connectionOptions: ConnectOptions = {
      walletDownloadUrl,
    };

    await connect(mockConnectionManager as unknown as ConnectionManager, connectionOptions);

    expect(mockConnectionManager.connectWallet).toHaveBeenCalled();
    expect(mockConnectionManager.getWalletProvider).toHaveBeenCalled();
    expect(open).toHaveBeenCalledTimes(1);
  });

  it('should not open wallet download link if connection fails and wallet provider is TM2', async () => {
    const mockError = new Error('Connection failed');
    mockConnectionManager.connectWallet.mockRejectedValue(mockError);
    mockConnectionManager.getWalletProvider.mockReturnValueOnce(mockWalletProvider);
    (isTM2WalletProvider as unknown as jest.Mock).mockReturnValue(true);

    const walletDownloadUrl = 'https://wallet-download-url.com';
    const connectionOptions: ConnectOptions = {
      walletDownloadUrl,
    };

    await connect(mockConnectionManager as unknown as ConnectionManager, connectionOptions);

    expect(mockConnectionManager.connectWallet).toHaveBeenCalled();
    expect(mockConnectionManager.getWalletProvider).toHaveBeenCalled();
    expect(open).toHaveBeenCalledTimes(0);
  });

  it('should not open wallet download link if connection fails and no walletDownloadUrl is provided', async () => {
    const mockError = new Error('Connection failed');
    mockConnectionManager.connectWallet.mockRejectedValue(mockError);
    mockConnectionManager.getWalletProvider.mockReturnValueOnce(mockWalletProvider);
    (isTM2WalletProvider as unknown as jest.Mock).mockReturnValue(false);

    const connectionOptions: ConnectOptions = {};

    await connect(mockConnectionManager as unknown as ConnectionManager, connectionOptions);

    expect(mockConnectionManager.connectWallet).toHaveBeenCalled();
    expect(mockConnectionManager.getWalletProvider).toHaveBeenCalled();
    expect(open).toHaveBeenCalledTimes(0);
  });
});
