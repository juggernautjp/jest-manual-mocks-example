// ESM version

import { jest } from '@jest/globals';

// jest.mock('node:fs');
jest.mock('node:fs');

describe('listFilesInDirectorySync', () => {
  const MOCK_FILE_INFO = {
    '/path/to/file1.js': 'console.log("file1 contents");',
    '/path/to/file2.txt': 'file2 contents',
  };

  
  beforeEach(async () => {
    // Set up some mocked out file info before each test
    const fs = await import('node:fs');
    fs.__setMockFiles(MOCK_FILE_INFO);
    /*
    import('node:fs').then( (fs) => {
      fs.__setMockFiles(MOCK_FILE_INFO);
    })
    */
  });

  // it('includes all files in the directory in the summary', async () => {
  it('includes all files in the directory in the summary', async () => {
     const FileSummarizer = await import('../FileSummarizer.mjs');
     const fileSummary =
      FileSummarizer.summarizeFilesInDirectorySync('/path/to');
    expect(fileSummary.length).toBe(2);
  });
});
