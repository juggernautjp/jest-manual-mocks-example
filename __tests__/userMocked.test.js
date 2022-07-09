// Copyright 2004-present Facebook. All Rights Reserved.
// 
// Manual Mocks - Using with ES module imports
// https://jestjs.io/docs/manual-mocks#using-with-es-module-imports

import { jest } from '@jest/globals';

jest.mock('../models/user.mjs'); /*, () => {
  return {
    __esModule: true,
    default: jest.fn(
      () => ({age: 622, name: 'Mock name'})),
    getAuthenticated: jest.fn(
      async () => ({age: 622, name: 'Mock name'}))
  };
});
*/

test('if user model is mocked', async () => {
  const user = await import('../models/user.mjs');
  const expected = { age: 622, name: 'Mock name' };
  expect(user.default.getAuthenticated()).toEqual(expected);
});
