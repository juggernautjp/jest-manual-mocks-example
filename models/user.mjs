// Copyright 2004-present Facebook. All Rights Reserved.

// jest.createMockFromModule(moduleName)
// https://jestjs.io/ja/docs/jest-object#jestcreatemockfrommodulemodulename
export default {
  getAuthenticated: () => ({
    age: 26,
    name: 'Real name',
  }),
};

/* The above code is equivalent to:
var user = {
  getAuthenticated: () => ({
      age: 26,
      name: 'Real name'
  })
};

export {user as default};
*/
