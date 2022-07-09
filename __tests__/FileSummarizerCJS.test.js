// Copyright 2004-present Facebook. All Rights Reserved.

// Without node:fs module Mock

// require CommonJS Module
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const summarizeFilesInDirectorySync = require('../FileSummarizer.cjs').summarizeFilesInDirectorySync;

test('without node:fs module', () => {
  const dir = "./models";
  const expected =  [{"directory": "./models", "fileName": "user.mjs"}, {"directory": "./models", "fileName": "__mocks__"}];
  expect(summarizeFilesInDirectorySync(dir)).toEqual(expected);
});
