import { mockSessionStorage } from './mock-storage';

export const defineGlobalMock = () => {
  Object.defineProperty(global, 'sessionStorage', {
    value: mockSessionStorage,
  });
  Object.defineProperty(global, 'open', {
    value: jest.fn(),
    configurable: true,
  });
  Object.defineProperty(global, 'console', {
    value: {
      ...console,
      error() {},
    },
  });
};

export const clearGlobalMock = () => {
  Object.defineProperty(global, 'sessionStorage', {});
  Object.defineProperty(global, 'open', {});
  Object.defineProperty(global, 'console', {});
};
