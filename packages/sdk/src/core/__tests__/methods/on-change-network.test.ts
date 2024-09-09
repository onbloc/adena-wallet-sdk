import { mockWalletProvider } from '../../__mocks__/mock-wallet-provider';
import { onChangeNetwork } from '../../methods';
import { OnChangeNetworkOptions } from '../../types/methods'; // Adjust imports based on your actual file structure

describe('onChangeNetwork', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call onChangeNetwork with the correct options', () => {
    const mockCallback = jest.fn();
    const options: OnChangeNetworkOptions = { callback: mockCallback };

    onChangeNetwork(mockWalletProvider, options);

    expect(mockWalletProvider.onChangeNetwork).toHaveBeenCalledWith(options);
  });
});
