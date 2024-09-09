import { mockWalletProvider } from '../../__mocks__/mock-wallet-provider';
import { onChangeAccount } from '../../methods';
import { OnChangeAccountOptions } from '../../types/methods'; // Adjust imports based on your actual file structure

describe('onChangeAccount', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call onChangeAccount with the correct options', () => {
    const mockCallback = jest.fn();
    const options: OnChangeAccountOptions = { callback: mockCallback };

    onChangeAccount(mockWalletProvider, options);

    expect(mockWalletProvider.onChangeAccount).toHaveBeenCalledWith(options);
  });
});
