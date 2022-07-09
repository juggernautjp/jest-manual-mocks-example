// Copyright 2004-present Facebook. All Rights Reserved.

// Without node:fs module Mock

// FileSummarizer.js === FileSummarizer.mjs (ESM)
import {summarizeFilesInDirectorySync} from '../FileSummarizer.mjs';

test('without node:fs module', () => {
  const dir = "./models";
  const expected =  [{"directory": "./models", "fileName": "user.mjs"}, {"directory": "./models", "fileName": "__mocks__"}];
  expect(summarizeFilesInDirectorySync(dir)).toEqual(expected);
});
