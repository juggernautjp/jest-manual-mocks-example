// ES Module Mock versioon 'fj.mjs', which is based on the CommonJS Module Mock 'fj.cjs' 
// 'use strict';

const path = require('node:path');
const fs = jest.createMockFromModule('node:fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);
fs.__setMockFiles = (newMockFiles) => {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }
};

// A custom version of `readdirSync` that reads from the special mocked out
fs.readdirSync = (directoryPath) => {
  return mockFiles[directoryPath] || [];
};

export default fs;
