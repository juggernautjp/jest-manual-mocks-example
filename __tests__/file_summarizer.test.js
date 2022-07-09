// Copyright 2004-present Facebook. All Rights Reserved.

// 'use strict';

import { jest } from '@jest/globals';

// Node.js - `module.createRequire(filename)`
// https://nodejs.org/api/module.html#modulecreaterequirefilename
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

jest.mock('fs');

describe('listFilesInDirectorySync', () => {
  const MOCK_FILE_INFO = {
    '/path/to/file1.js': 'console.log("file1 contents");',
    '/path/to/file2.txt': 'file2 contents',
  };

  beforeEach(() => {
    // Set up some mocked out file info before each test
    require('fs').__setMockFiles(MOCK_FILE_INFO);
  });

  // it('includes all files in the directory in the summary', async () => {
  it('includes all files in the directory in the summary', () => {
     const FileSummarizer = require('../FileSummarizer.cjs');
     const fileSummary =
      FileSummarizer.summarizeFilesInDirectorySync('/path/to');
    expect(fileSummary.length).toBe(2);
  });
});
