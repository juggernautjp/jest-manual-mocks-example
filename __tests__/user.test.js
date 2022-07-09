// Copyright 2004-present Facebook. All Rights Reserved.

import user from '../models/user.mjs';

test('if original user model', () => {
  expect(user.getAuthenticated()).toEqual({age: 26, name: 'Real name'});
});
