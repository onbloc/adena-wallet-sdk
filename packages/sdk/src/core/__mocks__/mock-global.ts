import { mockSessionStorage } from './mock-storage';

export const defineGlobalMock = () => {
  Object.defineProperty(global, 'sessionStorage', {
    value: mockSessionStorage,
  });
};

export const clearGlobalMock = () => {
  Object.defineProperty(global, 'sessionStorage', {});
};
